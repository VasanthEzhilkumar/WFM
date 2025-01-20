; Example 1 - calling the MessageBox API directly
$result = DllCall("user32.dll", "int", "MessageBox", "hwnd", 0, "str", "Some text", "str", "Some title", "int", 0)

; Example 2 - calling a function that modifies parameters
$hwnd = WinGetHandle("Untitled - Notepad")
$result = DllCall("user32.dll", "int", "GetWindowText", "hwnd", $hwnd, "str", "", "int", 32768)
msgbox(0, "", $result[0])	; number of chars returned
msgbox(0, "", $result[2])	; Text returned in param 2