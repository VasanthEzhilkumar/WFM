$var = RegEnumKey("HKEY_LOCAL_MACHINE\SOFTWARE", 1)
MsgBox(4096, "First SubKey under HKLM\Software: ", $var)
$var = RegEnumKey("HKEY_LOCAL_MACHINE\SOFTWARE", 2)
MsgBox(4096, "Second SubKey under HKLM\Software: ", $var)
