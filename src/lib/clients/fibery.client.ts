import axios, { AxiosInstance, AxiosResponse } from "axios";

// Loads token
import dotenv, { config } from "dotenv";

dotenv.config();

interface FiberyQuery {
  "q/from": string;
  "q/select": string[];
  "q/where"?: any[];
  "q/limit"?: number | string;
  "q/offset"?: number;
  "q/order-by"?: Array<[string, string]>;
}

const WORKSPACE = "team-lemonade";
const TIMEOUT = 30000;

export class FiberyClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://${WORKSPACE}.fibery.io`;
    const token = process.env.FIBERY_API_KEY;

    if (!token) {
      throw new Error(
        "Fibery API token is required. Provide it in config or set FIBERY_API_KEY environment variable."
      );
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      timeout: TIMEOUT,
    });
  }

  async getAllHomeBionicsBugs() {
    const query = [
      {
        command: "fibery.entity/query",
        args: {
          query: {
            "q/from": "Quality/Bug Report",
            "q/select": {
              "fibery/id": ["fibery/id"],
              "fibery/public-id": ["fibery/public-id"],
              "fibery/rank": ["fibery/rank"],
              "?access/check": ["q/access?", ["Quality/Name"]],
              "Quality/Name": ["Quality/Name"],
              "Quality/Example URL": ["Quality/Example URL"],
              "Files/Files": {
                "q/from": ["Files/Files"],
                "q/select": {
                  "fibery/id": ["fibery/id"],
                  "fibery/name": ["fibery/name"],
                  "?access/check": ["q/access?", ["fibery/name"]],
                  "fibery/creation-date": ["fibery/creation-date"],
                  "fibery/content-type": ["fibery/content-type"],
                  "fibery/content-length": ["fibery/content-length"],
                  "fibery/secret": ["fibery/secret"],
                  "fibery/rank": ["fibery/rank"],
                },
                "q/limit": "q/no-limit",
              },
              "Quality/Priority": {
                "fibery/id": ["Quality/Priority", "fibery/id"],
                "fibery/public-id": ["Quality/Priority", "fibery/public-id"],
                "enum/name": ["Quality/Priority", "enum/name"],
                "fibery/rank": ["Quality/Priority", "fibery/rank"],
                "?access/check": [
                  "q/access?",
                  ["Quality/Priority", "enum/name"],
                ],
                "?accessToIcon": [
                  "q/access?",
                  ["Quality/Priority", "enum/icon"],
                ],
                "enum/color": ["Quality/Priority", "enum/color"],
                "enum/icon": ["Quality/Priority", "enum/icon"],
              },
              "Quality/Number of Related Bugs": [
                "Quality/Number of Related Bugs",
              ],
              "Quality/Sub Issue Type": {
                "fibery/id": ["Quality/Sub Issue Type", "fibery/id"],
                "fibery/public-id": [
                  "Quality/Sub Issue Type",
                  "fibery/public-id",
                ],
                "enum/name": ["Quality/Sub Issue Type", "enum/name"],
                "fibery/rank": ["Quality/Sub Issue Type", "fibery/rank"],
                "?access/check": [
                  "q/access?",
                  ["Quality/Sub Issue Type", "enum/name"],
                ],
                "?accessToIcon": [
                  "q/access?",
                  ["Quality/Sub Issue Type", "enum/icon"],
                ],
                "enum/color": ["Quality/Sub Issue Type", "enum/color"],
                "enum/icon": ["Quality/Sub Issue Type", "enum/icon"],
              },
              "Tags/Tags": {
                "q/from": ["Tags/Tags"],
                "q/select": {
                  "fibery/id": ["fibery/id"],
                  "Tags/Name": ["Tags/Name"],
                  "fibery/public-id": ["fibery/public-id"],
                  "?access/check": ["q/access?", ["Tags/Name"]],
                },
                "q/limit": "q/no-limit",
              },
              "Quality/Bug Area": {
                "fibery/id": ["Quality/Bug Area", "fibery/id"],
                "fibery/public-id": ["Quality/Bug Area", "fibery/public-id"],
                "Quality/name": ["Quality/Bug Area", "Quality/name"],
                "fibery/rank": ["Quality/Bug Area", "fibery/rank"],
                "?access/check": [
                  "q/access?",
                  ["Quality/Bug Area", "Quality/name"],
                ],
              },
              "Quality/Tasks": {
                "q/from": ["Quality/Tasks"],
                "q/select": {
                  "fibery/id": ["fibery/id"],
                  "Software Dev/name": ["Software Dev/name"],
                  "fibery/public-id": ["fibery/public-id"],
                  "?access/check": ["q/access?", ["Software Dev/name"]],
                },
                "q/limit": "q/no-limit",
              },
              "Quality/Closing Reason": {
                "fibery/id": ["Quality/Closing Reason", "fibery/id"],
                "fibery/public-id": [
                  "Quality/Closing Reason",
                  "fibery/public-id",
                ],
                "enum/name": ["Quality/Closing Reason", "enum/name"],
                "fibery/rank": ["Quality/Closing Reason", "fibery/rank"],
                "?access/check": [
                  "q/access?",
                  ["Quality/Closing Reason", "enum/name"],
                ],
                "?accessToIcon": [
                  "q/access?",
                  ["Quality/Closing Reason", "enum/icon"],
                ],
                "enum/color": ["Quality/Closing Reason", "enum/color"],
                "enum/icon": ["Quality/Closing Reason", "enum/icon"],
              },
              "?collection-count_comments/comments": [
                "q/count",
                ["comments/comments", "fibery/id"],
              ],
              "Quality/Description": {
                "fibery/id": ["Quality/Description", "fibery/id"],
                "Collaboration~Documents/secret": [
                  "Quality/Description",
                  "Collaboration~Documents/secret",
                ],
                "Collaboration~Documents/Snippet": [
                  "Quality/Description",
                  "Collaboration~Documents/Snippet",
                ],
              },
              "Quality/Error Log": ["Quality/Error Log"],
              "?is-final-state": [
                "=",
                ["workflow/state", "workflow/Final"],
                "$true",
              ],
              "fibery/creation-date": ["fibery/creation-date"],
              "comments/comments": {
                "q/from": ["comments/comments"],
                "q/select": {
                  "fibery/id": ["fibery/id"],
                  "fibery/public-id": ["fibery/public-id"],
                  "fibery/creation-date": ["fibery/creation-date"],
                  "comment/document-secret": ["comment/document-secret"],
                  "comments/parent": {
                    "fibery/id": ["comments/parent", "fibery/id"],
                  },
                  "fibery/created-by": {
                    "?access/check": [
                      "q/access?",
                      ["fibery/created-by", "user/name"],
                    ],
                    "fibery/id": ["fibery/created-by", "fibery/id"],
                    "user/email": ["fibery/created-by", "user/email"],
                    "user/name": ["fibery/created-by", "user/name"],
                    "avatar/avatars": {
                      "q/from": ["fibery/created-by", "avatar/avatars"],
                      "q/limit": "q/no-limit",
                      "q/select": {
                        "fibery/id": ["fibery/id"],
                        "fibery/name": ["fibery/name"],
                        "fibery/content-type": ["fibery/content-type"],
                        "fibery/secret": ["fibery/secret"],
                      },
                    },
                  },
                },
                "q/limit": "q/no-limit",
              },
            },
            "q/where": [
              "and",
              ["q/in", ["Quality/Product", "fibery/id"], "$where1"],
              ["q/in", ["Quality/Squad", "fibery/id"], "$where2"],
            ],
            "q/order-by": [
              [["fibery/creation-date"], "q/asc"],
              [["fibery/rank"], "q/asc"],
            ],
            "q/offset": 0,
            "q/limit": "q/no-limit",
            // "q/limit": 1,
          },
          params: {
            $where1: [
              "9aab57e0-6438-11ed-b71d-e3230c6115ba",
              "ab9d1ca0-6438-11ed-b71d-e3230c6115ba",
              "0caccf03-4c8f-4194-9fa7-e99c19db5952",
            ],
            $where2: [
              "ed74abe0-c392-11eb-bf81-09fe866ea77c",
              "540ec8a0-f764-11ef-9cb8-41208e9ebcfc",
            ],
          },
        },
      },
    ];

    const response = await this.client.post("/api/commands", query);
    return response.data[0].result;
  }

  async getDocuments(documentIds: string[]) {
    const query = {
      command: "get-documents",
      args: documentIds.map((id) => ({ secret: id })),
    };

    const response = await this.client.post(
      "/api/documents/commands?format=json",
      query
    );
    return response.data;
  }
}
