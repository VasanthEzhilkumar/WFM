$result = StringInStr("I am a String", "RING")
MsgBox(0, "Search result:", $result)

$location = StringInStr("How much wood could a woodchuch chuch is a woodchuck could chuck wood?", "wood", 0, 3)	; Find the 3rd occurance of "wood"
