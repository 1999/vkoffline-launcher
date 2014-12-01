import os
import json
import shutil


def build_release_archive():
    """
    Builds release ZIP for Chrome Web Store
    """
    if os.path.isdir("out") == False:
        os.mkdir("out")

    shutil.copytree("src", "out/src")

    # delete key from manifest
    with open("src/manifest.json", "r") as manifest:
        manifestData = json.load(manifest)
        del manifestData["key"]

        with open("out/src/manifest.json", "w") as builtManifest:
            json.dump(manifestData, builtManifest, indent=2)

    # zip archive
    shutil.make_archive("release", "zip", root_dir="out/src")
    shutil.rmtree("out/src")
    shutil.move("release.zip", "out/release.zip")

if __name__ == "__main__":
    build_release_archive()