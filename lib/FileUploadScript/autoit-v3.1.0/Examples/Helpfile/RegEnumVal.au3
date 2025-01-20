$var = RegEnumVal("HKEY_LOCAL_MACHINE\SOFTWARE\HiddenSoft\AutoIt3", 1)
MsgBox(4096, "First Value Name under in AutoIt3 key", $var)
$var = RegEnumVal("HKEY_LOCAL_MACHINE\SOFTWARE\HiddenSoft\AutoIt3", 2)
MsgBox(4096, "Second Value Name under in AutoIt3 key: ", $var)
