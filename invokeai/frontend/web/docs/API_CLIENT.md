# Generated axios API client

- [Generated axios API client](#generated-axios-api-client)
  - [Generation](#generation)
    - [Generate the API client from the nodes web server](#generate-the-api-client-from-the-nodes-web-server)
    - [Generate the API client from JSON](#generate-the-api-client-from-json)
      - [Getting the JSON from the nodes web server](#getting-the-json-from-the-nodes-web-server)
      - [Getting the JSON with a python script](#getting-the-json-with-a-python-script)
      - [Generate the API client](#generate-the-api-client)
  - [The generated client](#the-generated-client)
  - [API client customisation](#api-client-customisation)

This API client is generated by an [openapi code generator](https://github.com/ferdikoomen/openapi-typescript-codegen).

All files in `invokeai/frontend/web/src/services/api/` are made by the generator.

## Generation

The axios client may be generated by from the OpenAPI schema from the nodes web server, or from JSON.

### Generate the API client from the nodes web server

We need to start the nodes web server, which serves the OpenAPI schema to the generator.

1. Start the nodes web server.

```bash
# from the repo root
python scripts/invoke-new.py --web
```

2. Generate the API client.

```bash
# from invokeai/frontend/web/
yarn api:web
```

### Generate the API client from JSON

The JSON can be acquired from the nodes web server, or with a python script.

#### Getting the JSON from the nodes web server

Start the nodes web server as described above, then download the file.

```bash
# from invokeai/frontend/web/
curl http://localhost:9090/openapi.json -o openapi.json
```

#### Getting the JSON with a python script

Run this python script from the repo root, so it can access the nodes server modules.

The script will output `openapi.json` in the repo root. Then we need to move it to `invokeai/frontend/web/`.

```bash
# from the repo root
python invokeai/app/util/generate_openapi_json.py
mv invokeai/app/util/openapi.json invokeai/frontend/web/services/fixtures/
```

#### Generate the API client

Now we can generate the API client from the JSON.

```bash
# from invokeai/frontend/web/
yarn api:file
```

## The generated client

The client will be written to `invokeai/frontend/web/services/api/`:

- `axios` client
- TS types
- An easily parseable schema, which we can use to generate UI

## API client customisation

The generator has a default `request.ts` file that implements a base `axios` client. The generated client uses this base client.

One shortcoming of this is base client is it does not provide response headers unless the response body is empty. To fix this, we provide our own lightly-patched `request.ts`.

To access the headers, call `getHeaders(response)` on any response from the generated api client. This function is exported from `invokeai/frontend/web/src/services/util/getHeaders.ts`.
