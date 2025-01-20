For $i = 1 to 2
	$ret = Call("test" & $i)
	MsgBox(4096,"", $ret)
Next

Func test1()
	Return "Hello"
EndFunc

Func test2()
	Return "Bye"
EndFunc
