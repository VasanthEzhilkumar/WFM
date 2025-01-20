#include-once

; ------------------------------------------------------------------------------
;
; AutoIt Version: 3.0
; Language:       English
; Description:    Functions that assist with array management.
;
; ------------------------------------------------------------------------------




;===============================================================================
;
; Function Name:  _ArrayAdd()
; Description:    Adds a specified value at the end of an array, returning the
;                 adjusted array.
; Author(s):      Jos van der Zande <jdeb@autoitscript.com>
;
;===============================================================================
Func _ArrayAdd(ByRef $avArray, $sValue)
	If IsArray($avArray) Then
		ReDim $avArray[UBound($avArray) + 1]
		$avArray[UBound($avArray) - 1] = $sValue
		SetError(0)
		Return 1
	Else
		SetError(1)
		Return 0
	EndIf
EndFunc   ;==>_ArrayAdd


;===============================================================================
;
; Function Name:  _ArrayBinarySearch()
; Description:    Uses the binary search algorithm to search through a
;                 1-dimensional array.
; Author(s):      Jos van der Zande <jdeb@autoitscript.com>
;
;===============================================================================
Func _ArrayBinarySearch(ByRef $avArray, $sKey, $i_Base = 0)
	Local $iLwrLimit = $i_Base
	Local $iUprLimit
	Local $iMidElement
	
	If (Not IsArray($avArray)) Then
		SetError(1)
		Return ""
	EndIf
	
	$iUprLimit = UBound($avArray) - 1
	$iMidElement = Int( ($iUprLimit + $iLwrLimit) / 2)
	; sKey is smaller than the first entry
	If $avArray[$iLwrLimit] > $sKey Or $avArray[$iUprLimit] < $sKey Then
		SetError(2)
		Return ""
	EndIf
	
	While $iLwrLimit <= $iMidElement And $sKey <> $avArray[$iMidElement]
		If $sKey < $avArray[$iMidElement] Then
			$iUprLimit = $iMidElement - 1
		Else
			$iLwrLimit = $iMidElement + 1
		EndIf
		$iMidElement = Int( ($iUprLimit + $iLwrLimit) / 2)
	WEnd
	If $iLwrLimit > $iUprLimit Then
		; Entry not found
		SetError(3)
		Return ""
	Else
		;Entry found , return the index
		SetError(0)
		Return $iMidElement
	EndIf
EndFunc   ;==>_ArrayBinarySearch

;===============================================================================
;
; Function Name:    _ArrayCreate()
; Description:      Create a small array and quickly assign values.
; Parameter(s):     $v_0  - The first element of the array.
;                   $v_1  - The second element of the array (optional).
;                   ...
;                   $v_20 - The twentyfirst element of the array (optional).
; Requirement(s):   None.
; Return Value(s):  The array with values.
; Author(s):        Dale (Klaatu) Thompson
; Note(s):          None.
;
;===============================================================================
Func _ArrayCreate($v_0, $v_1 = 0, $v_2 = 0, $v_3 = 0, $v_4 = 0, $v_5 = 0, $v_6 = 0, $v_7 = 0, $v_8 = 0, $v_9 = 0, $v_10 = 0, $v_11 = 0, $v_12 = 0, $v_13 = 0, $v_14 = 0, $v_15 = 0, $v_16 = 0, $v_17 = 0, $v_18 = 0, $v_19 = 0, $v_20 = 0)
	
	Local $i_UBound = @NumParams
	Local $av_Array[$i_UBound]
	Local $i_Index

	For $i_Index = 0 To ($i_UBound - 1)
		$av_Array[$i_Index] = Eval("v_" & String($i_Index))
	Next
	Return $av_Array
EndFunc   ;==>_ArrayCreate


;===============================================================================
;
; Function Name:  _ArrayDelete()
; Description:    Deletes the specified element from the given array, returning
;                 the adjusted array.
; Author(s)       Cephas <cephas@clergy.net>
; Modifications   Array is passed via Byref  - Jos van der zande
;===============================================================================
Func _ArrayDelete(ByRef $avArray, $iElement)
	Local $iCntr = 0, $iUpper = 0, $iNewSize = 0
	
	If (Not IsArray($avArray)) Then
		SetError(1)
		Return ""
	EndIf
	
	; We have to define this here so that we're sure that $avArray is an array
	; before we get it's size.
	Local $iUpper = UBound($avArray)    ; Size of original array
	
	; If the array is only 1 element in size then we can't delete the 1 element.
	If $iUpper = 1 Then
		SetError(2)
		Return ""
	EndIf
	
	Local $avNewArray[$iUpper - 1]
	If $iElement < 0 Then
		$iElement = 0
	EndIf
	If $iElement > ($iUpper - 1) Then
		$iElement = ($iUpper - 1)
	EndIf
	If $iElement > 0 Then
		For $iCntr = 0 To $iElement - 1
			$avNewArray[$iCntr] = $avArray[$iCntr]
		Next
	EndIf
	If $iElement < ($iUpper - 1) Then
		For $iCntr = ($iElement + 1) To ($iUpper - 1)
			$avNewArray[$iCntr - 1] = $avArray[$iCntr]
		Next
	EndIf
	$avArray = $avNewArray
	SetError(0)
	Return 1
EndFunc   ;==>_ArrayDelete


;===============================================================================
;
; Function Name:  _ArrayDisplay()
; Description:    Displays a 1-dimensional array in a message box.
; Author(s):      Brian Keene <brian_keene@yahoo.com>
;
;===============================================================================
Func _ArrayDisplay(ByRef $avArray, $sTitle)
	Local $iCounter = 0, $sMsg = ""
	
	If (Not IsArray($avArray)) Then
		SetError(1)
		Return 0
	EndIf
	
	For $iCounter = 0 To UBound($avArray) - 1
		$sMsg = $sMsg & "[" & $iCounter & "]    = " & StringStripCR($avArray[$iCounter]) & @CR
	Next
	
	MsgBox(4096, $sTitle, $sMsg)
	SetError(0)
	Return 1
EndFunc   ;==>_ArrayDisplay


;===============================================================================
;
; Function Name:  _ArrayInsert()
; Description:    Add a new value at the specified position.
;
; Author(s):      Jos van der Zande <jdeb@autoitscript.com>
;
;===============================================================================
Func _ArrayInsert(ByRef $avArray, $iElement, $sValue = "")
	Local $iCntr = 0
	
	If Not IsArray($avArray) Then
		SetError(1)
		Return 0
	EndIf
	; Add 1 to the Array
	ReDim $avArray[UBound($avArray) + 1]
	; Move aqll entries one up till the specified Elemnt
	For $iCntr = UBound($avArray) - 1 To $iElement + 1 Step - 1
		$avArray[$iCntr] = $avArray[$iCntr - 1]
	Next
	; add the value in the specified element
	$avArray[$iCntr] = $sValue
	Return 1
EndFunc   ;==>_ArrayInsert


;===============================================================================
;
; Function Name:  _ArrayMax()
; Description:    Returns the highest value held in an array.
; Author(s):      Cephas <cephas@clergy.net>
;
;                 Jos van der Zande
; Modified:       Added $iCompNumeric and $i_Base parameters and logic
;===============================================================================
Func _ArrayMax($avArray, $iCompNumeric = 0, $i_Base = 0)
	If IsArray($avArray) Then
		Return $avArray[_ArrayMaxIndex($avArray, $iCompNumeric, $i_Base) ]
	Else
		SetError(1)
		Return ""
	EndIf
EndFunc   ;==>_ArrayMax


;===============================================================================
;
; Function Name:  _ArrayMaxIndex()
; Description:    Returns the index where the highest value occurs in the array.
; Author(s):      Cephas <cephas@clergy.net>
;
;                 Jos van der Zande
; Modified:       Added $iCompNumeric and $i_Base parameters and logic
;===============================================================================
Func _ArrayMaxIndex($avArray, $iCompNumeric = 0, $i_Base = 0)
	Local $iCntr, $iMaxIndex = 0
	
	If Not IsArray($avArray) Then
		SetError(1)
		Return ""
	EndIf
	
	Local $iUpper = UBound($avArray)
	For $iCntr = $i_Base To ($iUpper - 1)
		If $iCompNumeric = 1 Then
			If Number($avArray[$iMaxIndex]) < Number($avArray[$iCntr]) Then
				$iMaxIndex = $iCntr
			EndIf
		Else
			If $avArray[$iMaxIndex] < $avArray[$iCntr] Then
				$iMaxIndex = $iCntr
			EndIf
		EndIf
	Next
	SetError(0)
	Return $iMaxIndex
EndFunc   ;==>_ArrayMaxIndex


;===============================================================================
;
; Function Name:  _ArrayMin()
; Description:    Returns the lowest value held in an array.
; Author(s):      Cephas <cephas@clergy.net>
;
;                 Jos van der Zande
; Modified:       Added $iCompNumeric and $i_Base parameters and logic
;===============================================================================
Func _ArrayMin($avArray, $iCompNumeric = 0, $i_Base = 0)
	If IsArray($avArray) Then
		Return $avArray[_ArrayMinIndex($avArray, $iCompNumeric) ]
	Else
		SetError(1)
		Return ""
	EndIf
EndFunc   ;==>_ArrayMin


;===============================================================================
;
; Function Name:  _ArrayMinIndex()
; Description:    Returns the index where the lowest value occurs in the array.
; Author(s):      Cephas <cephas@clergy.net>
;
;                 Jos van der Zande
; Modified:       Added $iCompNumeric and $i_Base parameters and logic
;===============================================================================
Func _ArrayMinIndex($avArray, $iCompNumeric = 0, $i_Base = 0)
	Local $iCntr = 0, $iMinIndex = 0
	
	If Not IsArray($avArray) Then
		SetError(1)
		Return ""
	EndIf
	
	Local $iUpper = UBound($avArray)
	For $iCntr = $i_Base To ($iUpper - 1)
		If $iCompNumeric = 1 Then
			If Number($avArray[$iMinIndex]) > Number($avArray[$iCntr]) Then
				$iMinIndex = $iCntr
			EndIf
		Else
			If $avArray[$iMinIndex] > $avArray[$iCntr] Then
				$iMinIndex = $iCntr
			EndIf
		EndIf
	Next
	SetError(0)
	Return $iMinIndex
EndFunc   ;==>_ArrayMinIndex


;===============================================================================
;
; Function Name:  _ArrayPop()
; Description:    Returns the last element of an array, deleting that element
;                 from the array at the same time.
; Author(s):      Cephas <cephas@clergy.net>
; Modified:       Use Redim to remove last entry.
;===============================================================================
Func _ArrayPop(ByRef $avArray)
	Local $sLastVal
	If (Not IsArray($avArray)) Then
		SetError(1)
		Return ""
	EndIf
	$sLastVal = $avArray[UBound($avArray) - 1]
	; remove the last value
	If UBound($avArray) = 1 Then
		$avArray = ""
	Else
		ReDim $avArray[UBound($avArray) - 1]
	EndIf
	; return last value
	Return $sLastVal
EndFunc   ;==>_ArrayPop

;===============================================================================
;
; Function Name:  _ArrayReverse()
; Description:    Takes the given array and reverses the order in which the
;                 elements appear in the array.
; Author(s):      Brian Keene <brian_keene@yahoo.com>
;
;                 Jos van der Zande
; Modified:       Added $i_Base parameter and logic
;===============================================================================
Func _ArrayReverse(ByRef $avArray, $i_Base = 0)
	If (Not IsArray($avArray)) Then
		SetError(1)
		Return ""
	EndIf
	
	; Create a copy of the array.
	Local $avNewArray = $avArray
	Local $i_cnt = 1
	Local $iIndex1
	; Copy the elements in the array till $i_Base
	For $iIndex1 = 0 To $i_Base - 1
		$avArray[$iIndex1] = $avNewArray[$iIndex1]
	Next
	; Reverse the elements in the array.
	For $iIndex1 = $i_Base To UBound($avNewArray) - 1
		$avArray[$iIndex1] = $avNewArray[UBound($avNewArray) - $i_cnt]
		$i_cnt = $i_cnt + 1
	Next
	
	Return 1
EndFunc   ;==>_ArrayReverse


;===============================================================================
;
; Function Name:    _ArraySort()
; Description:      Sort a multi dimensional Array on a specific index using
;                   the shell sort algorithm
; Parameter(s):     $a_Array      - Array
;                   $i_Descending - Sort Descending when 1
;                   $i_Base       - Start sorting at this Array entry.
;                   $I_Ubound     - End sorting at this Array entry
;                   $i_Dim        - Number of dimensions
;                   $i_SortIndex  - The Index to Sort the Array on.
;                                 (for multi-dimensional arrays only)
; Requirement(s):   None
; Return Value(s):  On Success - 1 and the sorted array is set
;                   On Failure - 0 and sets @ERROR = 1
; Author(s):        Jos van der Zande <jdeb@autoitscript.com>
;                   LazyCoder - added $i_SortIndex option
;
;===============================================================================
;
Func _ArraySort(ByRef $a_Array, $i_Decending = 0, $i_Base = 0, $i_UBound = 0, $i_Dim = 1, $i_SortIndex = 0)
	Local $A_Size, $Gap, $Count, $Temp, $C_Dim
	Local $b_ExchangeValues = 0
	Local $IsChanged = 0
	
	; Set to ubound when not specified
	If $i_UBound < 1 Then $i_UBound = UBound($a_Array) - 1
	
	If UBound($a_Array) <= $i_UBound Or Not IsNumber($i_UBound) Then
		SetError(1)
		Return 0
	EndIf
	; Shell sort array
	$A_Size = $i_UBound
	$Gap = Int($A_Size / 2)
	$b_ExchangeValues = 0
	$IsChanged = 0
	;
	While $Gap <> 0
		$IsChanged = 0
		For $Count = $i_Base To ($A_Size - $Gap)
			$b_ExchangeValues = 0
			If $i_Dim = 1 Then
				If $i_Decending <> 1 Then; sort array Ascending
					If $a_Array[$Count] > $a_Array[$Count + $Gap] Then
						$b_ExchangeValues = 1
					EndIf
				Else  ; sort array Descending
					If $a_Array[$Count] < $a_Array[$Count + $Gap] Then
						$b_ExchangeValues = 1
					EndIf
				EndIf
				If ($b_ExchangeValues) Then
					$Temp = $a_Array[$Count]
					$a_Array[$Count] = $a_Array[$Count + $Gap]
					$a_Array[$Count + $Gap] = $Temp
					$IsChanged = 1
				EndIf
			Else
				If $i_Decending <> 1 Then; sort array Ascending
					If $a_Array[$Count][$i_SortIndex] > $a_Array[$Count + $Gap][$i_SortIndex] Then
						$b_ExchangeValues = 1
					EndIf
				Else  ; sort array Descending
					If $a_Array[$Count][$i_SortIndex] < $a_Array[$Count + $Gap][$i_SortIndex] Then
						$b_ExchangeValues = 1
					EndIf
				EndIf
				If ($b_ExchangeValues) Then
					For $C_Dim = 0 To $i_Dim - 1
						$Temp = $a_Array[$Count][$C_Dim]
						$a_Array[$Count][$C_Dim] = $a_Array[$Count + $Gap][$C_Dim]
						$a_Array[$Count + $Gap][$C_Dim] = $Temp
						$IsChanged = 1
					Next
				EndIf
			EndIf
		Next
		; If no changes were made to array, decrease $gap size
		If $IsChanged = 0 Then
			$Gap = Int($Gap / 2)
		EndIf
	WEnd
	Return 1
EndFunc   ;==>_ArraySort


;===============================================================================
;
; Function Name:  _ArraySwap()
; Description:    Swaps two elements of an array.
; Author(s):      David Nuttall <danuttall@rocketmail.com>
;
;===============================================================================
Func _ArraySwap(ByRef $svector1, ByRef $svector2)
	Local $sTemp = $svector1
	
	$svector1 = $svector2
	$svector2 = $sTemp
	
	SetError(0)
EndFunc   ;==>_ArraySwap


;===============================================================================
;
; Function Name:  _ArrayToClip()
; Description:    Sends the contents of an array to the clipboard.
; Author(s):      Cephas <cephas@clergy.net>
;
;                 Jos van der Zande
; Modified:       Added $i_Base parameter and logic
;===============================================================================
Func _ArrayToClip($avArray, $i_Base = 0)
	Local $iCntr, $iRetVal = 0, $sCr = "", $sText = ""
	
	If (IsArray($avArray)) Then
		For $iCntr = $i_Base To (UBound($avArray) - 1)
			$iRetVal = 1
			If $iCntr > $i_Base Then
				$sCr = @CR
			EndIf
			$sText = $sText & $sCr & $avArray[$iCntr]
		Next
	EndIf
	ClipPut($sText)
	Return $iRetVal
EndFunc   ;==>_ArrayToClip


;===============================================================================
;
; Function Name:  _ArrayToString()
; Description:    Places the elements of an array into a single string,
;                 separated by the specified delimiter.
; Author(s):      Brian Keene <brian_keene@yahoo.com>
;
;===============================================================================
Func _ArrayToString(ByRef $avArray, $sDelim, $iStart = 0, $iEnd = 0)
	; Declare local variables.
	Local $iCntr = 0, $iUBound = 0, $sResult = ""
	
	; If $avArray is an array then set var for efficiency sake.
	If (IsArray($avArray)) Then
		$iUBound = UBound($avArray) - 1
	EndIf
	If $iEnd = 0 Then $iEnd = $iUBound
	; Check for parameter validity.
	Select
		Case (Not IsArray($avArray))
			SetError(1)
			Return ""
		Case( ($iUBound + 1) < 2 Or UBound($avArray, 0) > 1)
			SetError(2)
			Return ""
		Case (Not IsInt($iStart))
			SetError(3)
			Return ""
		Case (Not IsInt($iEnd))
			SetError(5)
			Return ""
		Case (Not IsString($sDelim))
			SetError(7)
			Return ""
		Case ($sDelim = "")
			SetError(8)
			Return ""
		Case (StringLen($sDelim) > 1)
			SetError(9)
			Return ""
		Case ($iStart = -1 And $iEnd = -1)
			$iStart = 0
			$iEnd = $iUBound
		Case ($iStart < 0)
			SetError(4)
			Return ""
		Case ($iEnd < 0)
			SetError(6)
			Return ""
	EndSelect
	
	; Make sure that $iEnd <= to the size of the array.
	If ($iEnd > $iUBound) Then
		$iEnd = $iUBound
	EndIf
	
	; Combine the elements into the string.
	For $iCntr = $iStart To $iEnd
		$sResult = $sResult & $avArray[$iCntr]
		If ($iCntr < $iEnd) Then
			$sResult = $sResult & $sDelim
		EndIf
	Next
	
	SetError(0)
	Return $sResult
EndFunc   ;==>_ArrayToString

;===============================================================================
;
; FunctionName:     _ArrayTrim()
; Description:      Trims all elements in an array a certain number of characters.
; Syntax:           _ArrayTrim( $aArray, $iTrimNum , [$iTrimDirection] , [$iBase] , [$iUbound] )
; Parameter(s):     $aArray              - The array to trim the items of
;                   $iTrimNum            - The amount of characters to trim
;                    $iTrimDirection     - 0 to trim left, 1 to trim right
;                                            [Optional] : Default = 0
;                   $iBase               - Start trimming at this element in the array
;                                            [Optional] : Default = 0
;                   $iUbound             - End trimming at this element in the array
;                                            [Optional] : Default = Full Array
; Requirement(s):   None
; Return Value(s):  1 - If invalid array
;                   2 - Invalid base boundry parameter
;                   3 - Invalid end boundry parameter
;                   4 - If $iTrimDirection is not a zero or a one
;                    Otherwise it returns the new trimmed array
; Author(s):        Adam Moore (redndahead)
; Note(s):          None
;
;===============================================================================
Func _ArrayTrim($aArray, $iTrimNum, $iTrimDirection = 0, $iBase = 0, $iUBound = 0)
	Local $iArrayNum, $i
	
	;Validate array and options given
	If UBound($aArray) = 0 Then
		SetError(1)
		Return $aArray
	EndIf
	
	If $iBase < 0 Or Not IsNumber($iBase) Then
		SetError(2)
		Return $aArray
	EndIf
	
	If UBound($aArray) <= $iUBound Or Not IsNumber($iUBound) Then
		SetError(3)
		Return $aArray
	EndIf
	
	; Set to ubound when not specified
	If $iUBound < 1 Then $iUBound = UBound($aArray) - 1
	
	If $iTrimDirection < 1 Or $iTrimDirection > 2 Then
		SetError(4)
		Return
	EndIf
	;Trim it off
	For $i = $iBase To $iUBound
		If $iTrimDirection = 0 Then
			$aArray[$i] = StringTrimLeft($aArray[$i], $iTrimNum)
		Else
			$aArray[$i] = StringTrimRight($aArray[$i], $iTrimNum)
		EndIf
	Next
	Return $aArray
EndFunc   ;==>_ArrayTrim