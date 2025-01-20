$val = RunWait("Notepad.exe", "C:\WINDOWS", @SW_MAXIMIZE)
; script waits until Notepad closes
MsgBox(0, "Program returned with exit code:", $val)
