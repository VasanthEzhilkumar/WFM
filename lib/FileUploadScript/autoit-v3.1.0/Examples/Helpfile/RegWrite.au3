; Write a single REG_SZ value
RegWrite("HKEY_LOCAL_MACHINE\SOFTWARE", "TestKey", "REG_SZ", "Hello this is a test")


; Write the REG_MULTI_SZ value of "line1" and "line2"
RegWrite("HKEY_LOCAL_MACHINE\SOFTWARE", "TestKey", "REG_MULTI_SZ", "line1" & @LF & "line2")

; INCORRECT uses of REG_MULTI_SZ 
RegWrite("HKEY_LOCAL_MACHINE\SOFTWARE", "TestKey", "REG_MULTI_SZ", "line1" & @LF & "line2" & @LF)
RegWrite("HKEY_LOCAL_MACHINE\SOFTWARE", "TestKey", "REG_MULTI_SZ", "line1" & @LF & @LF & "line2" & @LF)

