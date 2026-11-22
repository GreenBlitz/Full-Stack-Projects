import json
import sys

import driving_scores
from wpilog import WpiLog


def main():
    path = sys.argv[1]
    log = WpiLog.load(path)
    print(json.dumps(driving_scores.get_driving_scores_JSON(log)))


if __name__ == '__main__':
    main()
