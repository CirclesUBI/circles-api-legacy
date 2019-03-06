# Circles Api [![Chat Server](https://chat.joincircles.net/api/v1/shield.svg?type=online&name=circles%20chat)](https://chat.joincircles.net) [![Backers](https://opencollective.com/circles/supporters/badge.svg)](https://opencollective.com/circles) [![Follow Circles](https://img.shields.io/twitter/follow/circlesubi.svg?label=follow+circles)](https://twitter.com/CirclesUBI) [![Circles License](https://img.shields.io/badge/license-APGLv3-orange.svg)](https://github.com/CirclesUBI/circles-api/blob/dev/LICENSE)


This holds the offchain components of the circles api

Api authenication is managed by `accesstoken` sent in the response headers

-------------

<a name="top"></a>
# user-profile-service v1.1.2

CRUD app for user and organization profiles

- [Notifs](#notifs)
	- [Delete User&#39;s own Notification](#delete-user&#39;s-own-notification)
	- [Request all User&#39;s own Notifications](#request-all-user&#39;s-own-notifications)
	- [Update User&#39;s own Notification](#update-user&#39;s-own-notification)
	
- [Offers](#offers)
	- [Delete User&#39;s own Offer](#delete-user&#39;s-own-offer)
	- [Request all Offers](#request-all-offers)
	- [Create an Offer](#create-an-offer)
	- [Update User&#39;s own Offer](#update-user&#39;s-own-offer)
	
- [Orgs](#orgs)
	- [Update User&#39;s own Organization](#update-user&#39;s-own-organization)
	- [Request User&#39;s own Organization](#request-user&#39;s-own-organization)
	- [Request all User&#39;s own Organizations](#request-all-user&#39;s-own-organizations)
	- [Create User&#39;s own Organization](#create-user&#39;s-own-organization)
	- [Update User&#39;s own Organization](#update-user&#39;s-own-organization)
	
- [Users](#users)
	- [Delete User&#39;s own record](#delete-user&#39;s-own-record)
	- [Request User&#39;s own record](#request-user&#39;s-own-record)
	- [Create User&#39;s own record](#create-user&#39;s-own-record)
	- [Update User&#39;s own record](#update-user&#39;s-own-record)
	


# <a name='notifs'></a> Notifs

## <a name='delete-user&#39;s-own-notification'></a> Delete User&#39;s own Notification
[Back to top](#top)



	DELETE /notifs/:notifId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  Notification | Number | <p>Id.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  None |  | <p>Returns nothing on success.</p>|

## <a name='request-all-user&#39;s-own-notifications'></a> Request all User&#39;s own Notifications
[Back to top](#top)



	GET /notifs/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Notification text.</p>|
|  dismissed | String | <p>Has this Notification been dismissed?</p>|
|  id | Number | <p>Id of the Notification (ascending integer).</p>|
|  owner_id | String | <p>Url User Id of the Notification owner.</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='update-user&#39;s-own-notification'></a> Update User&#39;s own Notification
[Back to top](#top)



	PUT /notifs/:notifId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  Notification | Number | <p>Id.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Notification text.</p>|
|  dismissed | String | <p>Has this Notification been dismissed?</p>|
|  id | Number | <p>Id of the Notification (ascending integer).</p>|
|  owner_id | String | <p>Url User Id of the Notification owner.</p>|
|  updated_at | Date | <p>Record update date.</p>|

# <a name='offers'></a> Offers

## <a name='delete-user&#39;s-own-offer'></a> Delete User&#39;s own Offer
[Back to top](#top)



	DELETE /offers/:offerId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  Offer | Number | <p>Id.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  None |  | <p>Returns nothing on success.</p>|

## <a name='request-all-offers'></a> Request all Offers
[Back to top](#top)



	GET /offers/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  amount | Number | <p>The amount of an item offered.</p>|
|  category | Boolean | <p>The category of item offered.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Offer description.</p>|
|  id | Number | <p>Id of the Offer (ascending integer).</p>|
|  item_code | String | <p>Item code for linking with POS systems.</p>|
|  owner_id | String | <p>Url User Id of the Offer owner.</p>|
|  percentage | Number | <p>Percentage of Offer to be paid in Circles (multiple of 0.1).</p>|
|  price | Number | <p>Price of Offer in Circles (multiple of 0.1).</p>|
|  public | Boolean | <p>Is this Offer publicly viewable?</p>|
|  title | String | <p>The title of the Offer.</p>|
|  type | Enum | <p>The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='create-an-offer'></a> Create an Offer
[Back to top](#top)



	POST /offers/






### Success 201

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  amount | Number | <p>The amount of an item offered.</p>|
|  category | Boolean | <p>The category of item offered.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Offer description.</p>|
|  id | Number | <p>Id of the Offer (ascending integer).</p>|
|  item_code | String | <p>Item code for linking with POS systems.</p>|
|  owner_id | String | <p>Url User Id of the Offer owner.</p>|
|  percentage | Number | <p>Percentage of Offer to be paid in Circles (multiple of 0.1).</p>|
|  price | Number | <p>Price of Offer in Circles (multiple of 0.1).</p>|
|  public | Boolean | <p>Is this Offer publicly viewable?</p>|
|  title | String | <p>The title of the Offer.</p>|
|  updated_at | Date | <p>Record update date.</p>|
### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  type | Enum | <p>The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.</p>|

## <a name='update-user&#39;s-own-offer'></a> Update User&#39;s own Offer
[Back to top](#top)



	PUT /offers/:offerId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  Offer | Number | <p>Id.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  amount | Number | <p>The amount of an item offered.</p>|
|  category | Boolean | <p>The category of item offered.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Offer description.</p>|
|  id | Number | <p>Id of the Offer (ascending integer).</p>|
|  item_code | String | <p>Item code for linking with POS systems.</p>|
|  owner_id | String | <p>Url User Id of the Offer owner.</p>|
|  percentage | Number | <p>Percentage of Offer to be paid in Circles (multiple of 0.1).</p>|
|  price | Number | <p>Price of Offer in Circles (multiple of 0.1).</p>|
|  public | Boolean | <p>Is this Offer publicly viewable?</p>|
|  title | String | <p>The title of the Offer.</p>|
|  type | Enum | <p>The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.</p>|
|  updated_at | Date | <p>Record update date.</p>|

# <a name='orgs'></a> Orgs

## <a name='update-user&#39;s-own-organization'></a> Update User&#39;s own Organization
[Back to top](#top)



	DELETE /orgs/:orgId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  orgId | String | <p>Organization UUID.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  None |  | <p>Returns nothing on success.</p>|

## <a name='request-user&#39;s-own-organization'></a> Request User&#39;s own Organization
[Back to top](#top)



	GET /orgs/:orgId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  orgId | String | <p>Organization UUID.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  address | String | <p>Organisation address.</p>|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Organization tagline.</p>|
|  email | String | <p>Email of the Organization.</p>|
|  id | String | <p>UUID of the Organization.</p>|
|  last_active | Date | <p>Last date Organization was active.</p>|
|  latitude | Float | <p>Latitude of Organization</p>|
|  longitude | Float | <p>longitude of Organization</p>|
|  organization_name | String | <p>Display name of Organization.</p>|
|  owner_id | String | <p>Url User Id of the Organization owner.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='request-all-user&#39;s-own-organizations'></a> Request all User&#39;s own Organizations
[Back to top](#top)



	GET /orgs/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  address | String | <p>Organisation address.</p>|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Organization tagline.</p>|
|  email | String | <p>Email of the Organization.</p>|
|  id | String | <p>UUID of the Organization.</p>|
|  last_active | Date | <p>Last date Organization was active.</p>|
|  latitude | Float | <p>Latitude of Organization</p>|
|  longitude | Float | <p>longitude of Organization</p>|
|  organization_name | String | <p>Display name of Organization.</p>|
|  owner_id | String | <p>Url User Id of the Organization owner.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='create-user&#39;s-own-organization'></a> Create User&#39;s own Organization
[Back to top](#top)

<p>Create Organization record (201) or return if exists (200)</p>

	POST /orgs/






### Success 200/201

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  address | String | <p>Organisation address.</p>|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Organization tagline.</p>|
|  email | String | <p>Email of the Organization.</p>|
|  id | String | <p>UUID of the Organization.</p>|
|  last_active | Date | <p>Last date Organization was active.</p>|
|  latitude | Float | <p>Latitude of Organization</p>|
|  longitude | Float | <p>longitude of Organization</p>|
|  organization_name | String | <p>Display name of Organization.</p>|
|  owner_id | String | <p>Url User Id of the Organization owner.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='update-user&#39;s-own-organization'></a> Update User&#39;s own Organization
[Back to top](#top)



	PUT /orgs/:orgId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  orgId | String | <p>Organization UUID.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  address | String | <p>Organisation address.</p>|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Organization tagline.</p>|
|  email | String | <p>Email of the Organization.</p>|
|  id | String | <p>UUID of the Organization.</p>|
|  last_active | Date | <p>Last date Organization was active.</p>|
|  latitude | Float | <p>Latitude of Organization</p>|
|  longitude | Float | <p>longitude of Organization</p>|
|  organization_name | String | <p>Display name of Organization.</p>|
|  owner_id | String | <p>Url User Id of the Organization owner.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|

# <a name='users'></a> Users

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
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|

## <a name='create-user&#39;s-own-record'></a> Create User&#39;s own record
[Back to top](#top)

<p>Create User record (201) or return if exists (200)</p>

	POST /users/






### Success 200/201

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|

## <a name='update-user&#39;s-own-record'></a> Update User&#39;s own record
[Back to top](#top)



	PUT /users/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|


<a name="top"></a>
# user-profile-service v1.1.2

CRUD app for user and organization profiles

- [Notifs](#notifs)
	- [Delete User&#39;s own Notification](#delete-user&#39;s-own-notification)
	- [Request all User&#39;s own Notifications](#request-all-user&#39;s-own-notifications)
	- [Update User&#39;s own Notification](#update-user&#39;s-own-notification)
	
- [Offers](#offers)
	- [Delete User&#39;s own Offer](#delete-user&#39;s-own-offer)
	- [Request all Offers](#request-all-offers)
	- [Create an Offer](#create-an-offer)
	- [Update User&#39;s own Offer](#update-user&#39;s-own-offer)
	
- [Orgs](#orgs)
	- [Update User&#39;s own Organization](#update-user&#39;s-own-organization)
	- [Request User&#39;s own Organization](#request-user&#39;s-own-organization)
	- [Request all User&#39;s own Organizations](#request-all-user&#39;s-own-organizations)
	- [Create User&#39;s own Organization](#create-user&#39;s-own-organization)
	- [Update User&#39;s own Organization](#update-user&#39;s-own-organization)
	
- [Users](#users)
	- [Delete User&#39;s own record](#delete-user&#39;s-own-record)
	- [Request User&#39;s own record](#request-user&#39;s-own-record)
	- [Create User&#39;s own record](#create-user&#39;s-own-record)
	- [Update User&#39;s own record](#update-user&#39;s-own-record)
	


# <a name='notifs'></a> Notifs

## <a name='delete-user&#39;s-own-notification'></a> Delete User&#39;s own Notification
[Back to top](#top)



	DELETE /notifs/:notifId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  notifId | Number | <p>Notification Id.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  None |  | <p>Returns nothing on success.</p>|

## <a name='request-all-user&#39;s-own-notifications'></a> Request all User&#39;s own Notifications
[Back to top](#top)



	GET /notifs/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Notification text.</p>|
|  dismissed | String | <p>Has this Notification been dismissed?</p>|
|  id | Number | <p>Id of the Notification (ascending integer).</p>|
|  owner_id | String | <p>Url User Id of the Notification owner.</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='update-user&#39;s-own-notification'></a> Update User&#39;s own Notification
[Back to top](#top)



	PUT /notifs/:notifId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  notifId | Number | <p>Notification Id.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Notification text.</p>|
|  dismissed | String | <p>Has this Notification been dismissed?</p>|
|  id | Number | <p>Id of the Notification (ascending integer).</p>|
|  owner_id | String | <p>Url User Id of the Notification owner.</p>|
|  updated_at | Date | <p>Record update date.</p>|

# <a name='offers'></a> Offers

## <a name='delete-user&#39;s-own-offer'></a> Delete User&#39;s own Offer
[Back to top](#top)



	DELETE /offers/:offerId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  offerId | Number | <p>Offer Id.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  None |  | <p>Returns nothing on success.</p>|

## <a name='request-all-offers'></a> Request all Offers
[Back to top](#top)



	GET /offers/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  amount | Number | <p>The amount of an item offered.</p>|
|  category | Boolean | <p>The category of item offered.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Offer description.</p>|
|  id | Number | <p>Id of the Offer (ascending integer).</p>|
|  item_code | String | <p>Item code for linking with POS systems.</p>|
|  owner_id | String | <p>Url User Id of the Offer owner.</p>|
|  percentage | Number | <p>Percentage of Offer to be paid in Circles (multiple of 0.1).</p>|
|  price | Number | <p>Price of Offer in Circles (multiple of 0.1).</p>|
|  public | Boolean | <p>Is this Offer publicly viewable?</p>|
|  title | String | <p>The title of the Offer.</p>|
|  type | Enum | <p>The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='create-an-offer'></a> Create an Offer
[Back to top](#top)



	POST /offers/






### Success 201

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  amount | Number | <p>The amount of an item offered.</p>|
|  category | Boolean | <p>The category of item offered.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Offer description.</p>|
|  id | Number | <p>Id of the Offer (ascending integer).</p>|
|  item_code | String | <p>Item code for linking with POS systems.</p>|
|  owner_id | String | <p>Url User Id of the Offer owner.</p>|
|  percentage | Number | <p>Percentage of Offer to be paid in Circles (multiple of 0.1).</p>|
|  price | Number | <p>Price of Offer in Circles (multiple of 0.1).</p>|
|  public | Boolean | <p>Is this Offer publicly viewable?</p>|
|  title | String | <p>The title of the Offer.</p>|
|  updated_at | Date | <p>Record update date.</p>|
### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  type | Enum | <p>The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.</p>|

## <a name='update-user&#39;s-own-offer'></a> Update User&#39;s own Offer
[Back to top](#top)



	PUT /offers/:offerId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  offerId | Number | <p>Offer Id.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  amount | Number | <p>The amount of an item offered.</p>|
|  category | Boolean | <p>The category of item offered.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Offer description.</p>|
|  id | Number | <p>Id of the Offer (ascending integer).</p>|
|  item_code | String | <p>Item code for linking with POS systems.</p>|
|  owner_id | String | <p>Url User Id of the Offer owner.</p>|
|  percentage | Number | <p>Percentage of Offer to be paid in Circles (multiple of 0.1).</p>|
|  price | Number | <p>Price of Offer in Circles (multiple of 0.1).</p>|
|  public | Boolean | <p>Is this Offer publicly viewable?</p>|
|  title | String | <p>The title of the Offer.</p>|
|  type | Enum | <p>The type of Offer {'ITEM', 'PERCENTAGE_ITEM', 'PERCENTAGE_CATEGORY'}.</p>|
|  updated_at | Date | <p>Record update date.</p>|

# <a name='orgs'></a> Orgs

## <a name='update-user&#39;s-own-organization'></a> Update User&#39;s own Organization
[Back to top](#top)



	DELETE /orgs/:orgId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  orgId | String | <p>Organization UUID.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  None |  | <p>Returns nothing on success.</p>|

## <a name='request-user&#39;s-own-organization'></a> Request User&#39;s own Organization
[Back to top](#top)



	GET /orgs/:orgId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  orgId | String | <p>Organization UUID.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  address | String | <p>Organisation address.</p>|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Organization tagline.</p>|
|  email | String | <p>Email of the Organization.</p>|
|  id | String | <p>UUID of the Organization.</p>|
|  last_active | Date | <p>Last date Organization was active.</p>|
|  latitude | Float | <p>Latitude of Organization</p>|
|  longitude | Float | <p>longitude of Organization</p>|
|  organization_name | String | <p>Display name of Organization.</p>|
|  owner_id | String | <p>Url User Id of the Organization owner.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='request-all-user&#39;s-own-organizations'></a> Request all User&#39;s own Organizations
[Back to top](#top)



	GET /orgs/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  address | String | <p>Organisation address.</p>|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Organization tagline.</p>|
|  email | String | <p>Email of the Organization.</p>|
|  id | String | <p>UUID of the Organization.</p>|
|  last_active | Date | <p>Last date Organization was active.</p>|
|  latitude | Float | <p>Latitude of Organization</p>|
|  longitude | Float | <p>longitude of Organization</p>|
|  organization_name | String | <p>Display name of Organization.</p>|
|  owner_id | String | <p>Url User Id of the Organization owner.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='create-user&#39;s-own-organization'></a> Create User&#39;s own Organization
[Back to top](#top)

<p>Create Organization record (201) or return if exists (200)</p>

	POST /orgs/






### Success 200/201

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  address | String | <p>Organisation address.</p>|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Organization tagline.</p>|
|  email | String | <p>Email of the Organization.</p>|
|  id | String | <p>UUID of the Organization.</p>|
|  last_active | Date | <p>Last date Organization was active.</p>|
|  latitude | Float | <p>Latitude of Organization</p>|
|  longitude | Float | <p>longitude of Organization</p>|
|  organization_name | String | <p>Display name of Organization.</p>|
|  owner_id | String | <p>Url User Id of the Organization owner.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|

## <a name='update-user&#39;s-own-organization'></a> Update User&#39;s own Organization
[Back to top](#top)



	PUT /orgs/:orgId





### Parameter Parameters

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  orgId | String | <p>Organization UUID.</p>|



### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  address | String | <p>Organisation address.</p>|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  description | String | <p>Organization tagline.</p>|
|  email | String | <p>Email of the Organization.</p>|
|  id | String | <p>UUID of the Organization.</p>|
|  last_active | Date | <p>Last date Organization was active.</p>|
|  latitude | Float | <p>Latitude of Organization</p>|
|  longitude | Float | <p>longitude of Organization</p>|
|  organization_name | String | <p>Display name of Organization.</p>|
|  owner_id | String | <p>Url User Id of the Organization owner.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|

# <a name='users'></a> Users

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
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|

## <a name='create-user&#39;s-own-record'></a> Create User&#39;s own record
[Back to top](#top)

<p>Create User record (201) or return if exists (200)</p>

	POST /users/






### Success 200/201

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|

## <a name='update-user&#39;s-own-record'></a> Update User&#39;s own record
[Back to top](#top)



	PUT /users/






### Success 200

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
|  agreed_to_disclaimer | Boolean | <p>Legal requirement.</p>|
|  created_at | Date | <p>Record creation date.</p>|
|  device_endpoint | String | <p>Notification endpoint.</p>|
|  device_id | String | <p>Device Id of phone.</p>|
|  display_name | String | <p>Full name of the User.</p>|
|  email | String | <p>Email of the User.</p>|
|  id | String | <p>UUID of the User.</p>|
|  phone_number | String | <p>Phone number of the User.</p>|
|  profile_pic_url | String | <p>Url of profile pic (stored on S3).</p>|
|  updated_at | Date | <p>Record update date.</p>|
|  username | String | <p>Username of the User.</p>|

