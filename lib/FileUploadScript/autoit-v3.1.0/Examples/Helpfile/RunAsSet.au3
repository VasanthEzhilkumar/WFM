; Set the RunAs parameters to use local adminstrator account
RunAsSet("Administrator", @Computername, "adminpassword")

; Run registry editor as admin
RunWait("regedit.exe")

; Reset user's permissions
RunAsSet()
