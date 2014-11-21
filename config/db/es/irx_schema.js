{
  "mappings": {
    "irx-eproduct": {
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string",
          "index_analyzer": "shingle_analyzer"
        },
        "builtUpArea": {
          "type": "nested"
        },
        "price": {
          "type": "integer"
        },
        "type": {
          "type": "string"
        },
        "bhk": {
          "type": "nested"
        },
        "possession": {
          "type": "string"
        },
        "location": {
          "type": "nested"
        }
      }
    },
    "irx-euser": {
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string",
          "index_analyzer": "shingle_analyzer"
        },
        "userId": {
          "type": "string"
        },
        "companyName": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "location": {
          "type": "nested"
        }
      }
    },
    "irx-elocation": {
      "properties": {
        "id": {
          "type": "string"
        },
        "name": {
          "type": "string",
          "index_analyzer": "shingle_analyzer"
        },
        "locality": {
          "type": "string",
          "index_analyzer": "shingle_analyzer"
        },
        "city": {
          "type": "string",
          "index_analyzer": "shingle_analyzer"
        },
        "state": {
          "type": "string",
          "index_analyzer": "shingle_analyzer"
        },
        "country": {
          "type": "string"
        },
        "pincode": {
          "type": "string"
        }
      }
    }
  },
  "settings": {
    "analysis": {
      "filter": {
        "shingle_filter": {
          "type": "shingle",
          "min_shingle_size": 2,
          "max_shingle_size": 5
        },
        "edgengram": {
          "type": "edgeNGram",
          "min_gram": 2,
          "max_gram": 30,
          "side": "front"
        }
      },
      "analyzer": {
        "shingle_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "shingle_filter"
          ]
        }
      }
    }
  }
}