# API Endpoints doc
To run the application, download a service account from Firebase and rename it to `serviceAccount.json`

## Environment Variables
Change Env setting in `docker-compose.yml`
1. _TEST_: This will use the Mock database (doesn't require Firebase account)
1. _PROD_: This will use the Firestore database.

## To run
1. `docker-compose up --build`

## Workspace Endpoints
### Create Workspace
`POST /workspace`
```
{
    "pwd":"WORKSPACE_PASSWORD",
    "name":"WORKSPACE_NAME"
}
```
Returns sample
```
{
    "key": "WORKSPACE_KEY"
}
```
The `key` is unique to your workspace, share it with people you want to collaborate.
### Delete Workspace
`DELETE /workspace`
```
{
    "pwd":"WORKSPACE_PASSWORD",
    "key": "WORKSPACE_KEY"
}
```
### Get Workspace name
`GET /workspace?key=KEY_OF_WORKSPACE`

Return sample
```
{
    "name" : "NAME_OF_WORKSPACE"
}
```
## Link Endpoints
### Get Links
`GET /link?key=KEY_OF_WORKSPACE`

Return sample
```
{
    "links": [
        {
            "name": "awesome link",
            "link: "example.com"
            "docID": "ID_OF_LINK"
        }
        {...}
    ]
}
```

### Create New Link
`POST /link`
```
{
    "key":"KEY_OF_WORKSPACE",
    "link": "link to save"
    "name":"link name",
}
```

### Update Link (Not supported on frontend)
`PUT /link`
```
{
    "docID": "ID_OF_LINK",
    "key": "KEY_OF_WORKSPACE",
    "name": "updated name",
    "link": "updated link"
}
```

### Delete Link
`DELETE /link`
```
{
    "docID": "ID_OF_LINK",
    "key": "KEY_OF_WORKSPACE"
}
```