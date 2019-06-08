#!/bin/sh
echo running script $0
signup=$(aws cognito-idp sign-up --region $1 --client-id $2 --username +1111111111 --password $3 --user-attributes Name=name,Value=test Name=email,Value=test@joincircles.net Name=picture,Value=https://cdn.dribbble.com/users/312581/screenshots/1676038/female-placeholder.png)
usersub=$signup.UserSub
echo "$usersub"
aws cognito-idp admin-confirm-sign-up --region $1 --user-pool-id $4 --username $usersub
aws cognito-idp admin-add-user-to-group --username $usersub --group-name test --user-pool-id $4