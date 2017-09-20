## Movable Type Configuration File
##
## This file defines system-wide
<<<<<<< HEAD
## settings for Movable Type. In
## total, there are over a hundred
## options, but only those
## critical for everyone are listed
## below.
##
## Information on all others can be
=======
## settings for Movable Type. In
## total, there are over a hundred
## options, but only those
## critical for everyone are listed
## below.
##
## Information on all others can be
>>>>>>> 8485a955de7ec6c7d7faba7245654bf81df658c4
## found at:
##  http://www.movabletype.jp/documentation/config

#======== REQUIRED SETTINGS ==========

CGIPath        /_mt/
StaticWebPath  /_mt/mt-static/
StaticFilePath /Users/Fumi-PC/htdocs/stocknow/develop/_mt/mt-static

#======== DATABASE SETTINGS ==========

ObjectDriver DBI::mysql
Database stocknow
DBUser stocknow
DBPassword stock
DBHost localhost

#======== MAIL =======================
EmailAddressMain deep.blue.f23@gmail.com
MailTransfer sendmail
SendMailPath /usr/sbin/sendmail

DefaultLanguage ja

SSLVerifyNone 1
ImageDriver ImageMagick
