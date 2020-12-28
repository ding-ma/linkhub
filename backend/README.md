# API Endpoints doc
To run the application, download a service account from Firebase and rename it to `serviceAccount.json`

## Environment Variables
Rename `sample.env` to `.env`. There are two possible settings
1. "TEST": This will use the Mock database
1. "PROD": This will use the Firestore database.

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

## Link Endpoints
### Get Links
`GET /link`
```
{
    "key":"KEY_OF_WORKSPACE"
}
```
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
    ],
    "workplace": "WORKSPACE_NAME"
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

### Update Link
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