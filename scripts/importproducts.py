#!/usr/bin/env python
import csv
import os
import random
import subprocess
import sys


FRONT_MATTER_DELIMITER_LINE = "---\n"
PRINT_PROGRESS_DOT_EVERY_X_ITEMS = 100
PRODUCT_IMAGE_BASE_URL_TO_REMOVE = "http://basement.greenash.net.au/"
PRODUCT_SWATCH_IMAGE_PREFIX = "product-swatch-image/"
PRODUCT_SWATCH_OVERLAY_IMAGE_PREFIX = "cube-swatch-overlay-image/"
PRODUCTS_CSV_PATH_ENVVAR_NAME = "ARCHIUNIT_PRODUCTS_CSV_PATH"
PRODUCTS_RELATIVE_PATH = "content/product"


def get_products_csv_path(products_csv_path):
    if not products_csv_path:
        raise ValueError(
            "Missing required environment variable {0}".format(
                PRODUCTS_CSV_PATH_ENVVAR_NAME))

    if not os.path.isfile(products_csv_path):
        raise ValueError((
            "Environment variable {0} value '{1}' is not a valid file").format(
                PRODUCTS_CSV_PATH_ENVVAR_NAME, products_csv_path))

    return os.path.realpath(products_csv_path)


def get_current_repo_path(this_script_path):
    current_repo_path = os.path.realpath(
        os.path.join(
            os.path.dirname(os.path.realpath(this_script_path)),
            ".."))

    if not os.path.isdir(current_repo_path):
        raise ValueError(
            "Expected current repo path {0} is not a valid directory".format(
                current_repo_path))

    return current_repo_path


def print_progress_dot(i, num_items):
    if i and ((not i % PRINT_PROGRESS_DOT_EVERY_X_ITEMS) or (i + 1 == num_items)):
        sys.stdout.write(".")

        if i + 1 == num_items:
            sys.stdout.write("\n")

        sys.stdout.flush()


def file_len(filename):
    """Thanks to: https://stackoverflow.com/a/845069"""
    proc = subprocess.Popen(
        ["wc", "-l", filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    result, err = proc.communicate()

    if proc.returncode != 0:
        raise IOError(err)

    return int(result.strip().split()[0])


def get_num_products_to_import(products_csv_path):
    return file_len(products_csv_path) - 1


def get_product_file_path(slug, current_repo_path):
    return os.path.realpath(os.path.join(
        current_repo_path, PRODUCTS_RELATIVE_PATH, "{0}.md".format(slug)))


def clean_image_filename(image_filename):
    return (
        image_filename
            .replace(PRODUCT_IMAGE_BASE_URL_TO_REMOVE, "")
            .replace("/", "_")
            .replace(" ", "_")
            .replace("(", "")
            .replace(")", ""))


def get_product_file_content(product_data):
    content = FRONT_MATTER_DELIMITER_LINE

    content += "title: {0}\n".format(product_data["product_title"])
    content += "cubeTitle: {0}\n".format(product_data["cube_title"])
    content += "brandSlug: {0}\n".format(product_data["brand_code"].lower())
    content += "uCode: {0}-U-{1}\n".format(
        product_data["brand_code"], product_data["product_code"])

    if product_data.get("swatch_image_url"):
        content += "swatchImage: {0}{1}\n".format(
            PRODUCT_SWATCH_IMAGE_PREFIX,
            clean_image_filename(product_data["swatch_image_url"]))

    if product_data.get("swatch_overlay_image_url"):
        content += "swatchOverlayImage: {0}{1}\n".format(
            PRODUCT_SWATCH_OVERLAY_IMAGE_PREFIX,
            clean_image_filename(product_data["swatch_overlay_image_url"]))

    if (
        product_data.get("colour_rgb_r")
        and product_data.get("colour_rgb_g")
        and product_data.get("colour_rgb_b")
    ):
        content += "colourRgb: {0}, {1}, {2}\n".format(
            product_data["colour_rgb_r"],
            product_data["colour_rgb_g"],
            product_data["colour_rgb_b"])

        colour_hex = "{0:02x}{1:02x}{2:02x}".format(
            int(product_data["colour_rgb_r"]),
            int(product_data["colour_rgb_g"]),
            int(product_data["colour_rgb_b"]))

        content += "colourHex: {0}\n".format(colour_hex.upper())

    if product_data.get("is_dark_colour") is not None:
        content += 'isDarkColour: "{0}"\n'.format(
            "true" if product_data["is_dark_colour"] == "Y" else "false")

    content += "websiteUrl: {0}\n".format(product_data["website_url"])
    content += "weight: {0}\n".format(random.randint(10000, 99999))

    content += FRONT_MATTER_DELIMITER_LINE

    return content


def import_product(product_data, current_repo_path):
    slug = "{0}-u-{1}".format(
        product_data["brand_code"].lower(),
        product_data["product_code"].lower())
    product_file_path = get_product_file_path(slug, current_repo_path)

    if os.path.isfile(product_file_path):
        return False

    content = get_product_file_content(product_data)

    with open(product_file_path, "w") as f:
        f.write(content)

    return True


def import_products(products_csv_path, num_items, current_repo_path):
    num_products_imported = 0
    num_products_existing = 0

    with open(products_csv_path) as csvfile:
        reader = csv.DictReader(csvfile)

        for i, row in enumerate(reader):
            is_imported = import_product(row, current_repo_path)
            print_progress_dot(i, num_items)

            if is_imported:
                num_products_imported += 1
            else:
                num_products_existing += 1

    return num_products_imported, num_products_existing


def run():
    products_csv_path = get_products_csv_path(
        os.environ.get(PRODUCTS_CSV_PATH_ENVVAR_NAME))
    current_repo_path = get_current_repo_path(__file__)

    num_products_to_import = get_num_products_to_import(products_csv_path)
    print("Found {0} products to import".format(num_products_to_import))

    num_products_imported, num_products_existing = (
        import_products(
            products_csv_path, num_products_to_import, current_repo_path))
    print("Imported {0} products".format(num_products_imported))
    print("Did not import {0} already-imported products".format(
        num_products_existing))


if __name__ == "__main__":
    run()
