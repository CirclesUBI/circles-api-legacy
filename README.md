# Circles Api [![Chat Server](https://chat.joincircles.net/api/v1/shield.svg?type=online&name=circles%20chat)](https://chat.joincircles.net) [![Backers](https://opencollective.com/circles/supporters/badge.svg)](https://opencollective.com/circles) [![Follow Circles](https://img.shields.io/twitter/follow/circlesubi.svg?label=follow+circles)](https://twitter.com/CirclesUBI)

This holds the offchain components of the circles api

Api authenication is managed by a `token` sent in the response headers

## Get User

Get the profile of the currently Authenticated User along with basic
subscription information.

**URL** : `/v1/user/:id`

**Method** : `GET`

**Auth required** : ??

**Permissions required** : ??  ownUser or anyUser

### Success Response

**Code** : `200 OK`

**Response example**


```
{
  id: string,
  agreedToDisclaimer:boolean, 
  createdAt: datetime;
  updateAt: datetime;
  lastActive: datetime;
  displayName: string;
  email: string;
  profilePicURL: string;
  organizations: [id];
}
```

### Notes

Defaults to current user if no id is passed

## Update User

Update allowed user parameters

**URL** : `/v1/user/:id`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : ownUser

**Request body**

```
{
  displayName: string;
  email: string; ??
  profilePicURL: string;
}
```

### Success Response

**Code** : `200 OK`

**Response examples**


```
{
  id: string,
  agreedToDisclaimer:boolean, 
  createdAt: datetime;
  updateAt: datetime;
  lastActive: datetime;
  displayName: string;
  email: string;
  profilePicURL: string;
  organizations: [id];
}
```

## Get Organization

Get the profile of the currently Authenticated User along with basic subscription information.

**URL** : `/v1/organization/:id`

**Method** : `GET`

**Auth required** : ??

**Permissions required** : ??  anyUser or public

### Success Response

**Code** : `200 OK`

**Response examples**


```
{
  id: string,
  agreedToDisclaimer:boolean, 
  createdAt: datetime;
  updateAt: datetime;
  lastActive: datetime;
  organizationName: string;
  email: string; ??
  profilePicURL: string; ??
  members: [id]; ??
  address: ?? <- do we assume a Berlin address?
  latitude: float;
  longitude: float;
  description: string;
}
```

## Update Organization

Get the profile of the currently Authenticated User along with basic subscription information.

**URL** : `/v1/organization/:id`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : ownOrganization

**Request body**

```
{
  organizationName: string;
  email: string; ??
  profilePicURL: string; ??
  members: [id]; ?? <- does this have the escalated permissions?
  address: ?? <- do we assume a Berlin address?
  latitude: float;
  longitude: float;
  description: string;
}
```

### Success Response

**Code** : `200 OK`

**Response examples**


```
{
  id: string,
  agreedToDisclaimer:boolean, 
  createdAt: datetime;
  updateAt: datetime;
  lastActive: datetime;
  organizationName: string;
  email: string; ??
  profilePicURL: string; ??
  members: [id]; ??
  address: ?? <- do we assume a Berlin address?
  latitude: float;
  longitude: float;
  description: string;
}
```

## Get Notifications

Gets notifications for a user of organization

**URL** : `/v1/notifications/`

**Method** : `GET`

**Auth required** : ??

**Permissions required** : ??  ownUser or anyUser

**Request params**:

| Parameter | Type | Required | Description |
| organization | id | false | id of the organization to fetch notifications for |

if not organization id is passed, will return user notifications

### Success Response

**Code** : `200 OK`

**Response example**


```
{
  id: string,
  desscription: string, 
  createdAt: datetime;
  updateAt: datetime;
  seen: boolean;
  dismissed: boolean; <- maybe only need first one
}
```


