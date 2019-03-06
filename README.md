# Circles Api [![Chat Server](https://chat.joincircles.net/api/v1/shield.svg?type=online&name=circles%20chat)](https://chat.joincircles.net) [![Backers](https://opencollective.com/circles/supporters/badge.svg)](https://opencollective.com/circles) [![Follow Circles](https://img.shields.io/twitter/follow/circlesubi.svg?label=follow+circles)](https://twitter.com/CirclesUBI) [![Circles License](https://img.shields.io/badge/license-APGLv3-orange.svg)](https://github.com/CirclesUBI/circles-api/blob/dev/LICENSE)


This holds the offchain components of the circles api

Api authenication is managed by `accesstoken` sent in the response headers
<a name="top"></a>
#  Circles API v1.1.2



- [User](#user)
	- [Delete User&#39;s own record](#delete-user&#39;s-own-record)
	- [Request User&#39;s own record](#request-user&#39;s-own-record)
	- [Create User&#39;s own record](#create-user&#39;s-own-record)
	- [Update User&#39;s own record](#update-user&#39;s-own-record)
	


# <a name='user'></a> User

## <a name='delete-user&#39;s-own-record'></a> Delete User&#39;s own record
[Back to top](#top)



	DELETE /users/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  None |  | <p>Returns nothing on success.</p>|

## <a name='request-user&#39;s-own-record'></a> Request User&#39;s own record
[Back to top](#top)



	GET /users/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  agreed_to_disclaimer | String | <p>Legal requirement.</p>|
|  created_at | String | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | String | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|

## <a name='create-user&#39;s-own-record'></a> Create User&#39;s own record
[Back to top](#top)

<p>If the User record already exists it will return the record</p>

	POST /users/






### Success 201

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  agreed_to_disclaimer | String | <p>Legal requirement.</p>|
|  created_at | String | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | String | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|
### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  agreed_to_disclaimer | String | <p>Legal requirement.</p>|
|  created_at | String | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | String | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|

## <a name='update-user&#39;s-own-record'></a> Update User&#39;s own record
[Back to top](#top)



	PUT /users/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  agreed_to_disclaimer | String | <p>Legal requirement.</p>|
|  created_at | String | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | String | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|


