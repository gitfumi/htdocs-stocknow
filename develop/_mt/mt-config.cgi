## Movable Type Configuration File
##
## This file defines system-wide
## settings for Movable Type. In
## total, there are over a hundred
## options, but only those
## critical for everyone are listed
## below.
##
## Information on all others can be
## found at:
##  http://www.movabletype.jp/documentation/config

#======== REQUIRED SETTINGS ==========

CGIPath        /_mt/
StaticWebPath  /_mt/mt-static/
StaticFilePath /srv/www/vhosts/stocknow/develop/_mt/mt-static

#======== DATABASE SETTINGS ==========

ObjectDriver DBI::mysql
Database stocknow
DBUser root
DBPassword root
DBHost d-mysql

#======== MAIL =======================
EmailAddressMain deep.blue.f23@gmail.com
MailTransfer sendmail
SendMailPath /

DefaultLanguage ja

ImageDriver ImageMagick
AllowFileInclude 1