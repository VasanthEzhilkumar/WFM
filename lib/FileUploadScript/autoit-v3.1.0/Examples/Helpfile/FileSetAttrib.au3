;mark all .au3 files in current directory as read-only and system
FileSetAttrib("*.au3", "+RS")
If @error Then MsgBox(4096,"Error", "Problem setting attributes."

;make all .bmp files in C:\ and sub-directories writable and archived
FileSetAttrib("C:\*.bmp", "-R+A", 1)
If @error Then MsgBox(4096,"Error", "Problem setting attributes."
