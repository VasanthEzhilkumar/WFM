#include <File.au3>

Dim $s_TempFile
$s_TempFile = _TempFile()

MsgBox(4096, "Name suitable for new temporary file", $s_TempFile)

Exit
