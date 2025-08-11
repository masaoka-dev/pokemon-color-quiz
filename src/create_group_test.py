"""
    This script creates a group of pokemons and returns the list of the group.
    The conditions for creation are received as the argument '-c' or '--config'.
    When not set the argument, this refers to `src/tmp/confing`.

    An example of `config` is as follows:

        area: =[1, 3, 4]
        is_final_evolution: =true
        omosa: <=6.0, >=50.0

    Usage: python3 src/create_group_test.py [-c {config}]
"""

import json
import argparse
import sys

def create_group():
    
    parser = argparse.ArgumentParser()

    parser.add_argument("-c", "--config", default="")

    args = parser.parse_args()


    key_int     = ["id", "no", "sub", "area", "tokusei_1", "tokusei_2", "tokusei_3", "type_1", "type_2", "mega_flg", "genshi_flg", "kyodai_flg"]
    key_float   = ["omosa", "takasa"]
    key_boolean = ["is_final_evolution"]


    def compare_data(data1, data2, relation) -> bool:
        if relation == "=":
            return data1 == data2
        elif relation == ">":
            return data1 >= data2
        elif relation == "<":
            return data1 <= data2
        elif relation == "!":
            return data1 != data2
        else:
            print(f"💀 Error: Invalid config. You cannot use relation '{relation}='.", file=sys.stderr)
            exit(1)

    def cast(target):
        return int(str(target).replace(",", "")) if config_key in key_int else float(str(target).replace(",", "")) if config_key in key_float else True if config_key in key_boolean and str(target).lower() == "true" else False if config_key in key_boolean and str(target).lower() == "false" else target


    # Get config
    raw_config = args.config
    if raw_config == "":
        with open("src/tmp/config", "r") as f:
            raw_config = f.read()
    else: 
        raw_config = raw_config.replace("\\n", "\n")

    config_list = raw_config.split("\n")
    config_list = [c for c in config_list if c != ""]


    with open("public/data/pokemon_data.jsonl", "r") as f:
        raw_data = [json.loads(l) for l in f.readlines()]


    dropout_all = set()

    # Parse config contents
    for config_line in config_list:
        # Split into key and content
        try:
            config_key, raw_config_content = config_line.split(":")
            config_key = config_key.strip()
        except:
            print("💀 Error: Invalid config. You cannot use ':' in config contents.", file=sys.stderr)
            exit(1)

        # Extract relations
        config_content_list = raw_config_content.split("=")

        config_relation_list = ["=" if not content[-1] in [">", "<", "!"] else content[-1] for content in config_content_list[:-1]]
        config_content_list = [content.strip() if i == len(config_relation_list)-1 or relation == "=" else content[:-1].strip() for i, (content, relation) in enumerate(zip(config_content_list[1:], config_relation_list))]

        # Compare conditions
        for content, relation in zip(config_content_list, config_relation_list):
            if content[-1] == ",":
                content = content[:-1]
            if content[0] == "[" and content[-1] == "]":
                conditions = content[1:-1].split(",")
            else:
                conditions = [content]
            dropout_oneline = set(range(len(raw_data)))
            for condition in conditions:
                condition_cast = cast(condition.strip())
                dropout_oneline &= set(i for i, target in enumerate(raw_data) if not compare_data(cast(target[config_key]), condition_cast, relation))
            dropout_all |= dropout_oneline


    created_group = (l for i, l in enumerate(raw_data) if not i in dropout_all)

    # Output
    with open("src/data/pokemon_data_group_test.jsonl", "w") as f:
        f.writelines([f"{json.dumps(l, ensure_ascii=False)}\n" for l in created_group])
    return created_group


if __name__ == "__main__":
    create_group()
    