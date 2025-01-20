#include-once

; ------------------------------------------------------------------------------
;
; AutoIt Version: 3.0
; Language:       English
; Description:    Functions that assist with mathematical calculations.
;
; ------------------------------------------------------------------------------


;=============================================================================
;
; Function Name:   _Ceil()
;
; Description:     Returns the next integer value above the specified value.
;
; Syntax:          _Ceil( $nValue )
;
; Parameter(s);    $nValue     = Number to be evaluated.
;
; Requirement(s):  External:   = None.
;                  Internal:   = None.
;
; Return Value(s): On Success: = Returns next integer value above $nValue.
;                  On Failure: = Returns 0.
;                  @ERROR:     = 0 = No error.
;                                1 = $nValue isn't a number.
;
; Author(s):       Brian Keene <brian_keene@yahoo.com>
;
; Note(s):         Any value from the integer itself up to the next integer
;                  will be returned as the next integer above it (ex. "25.3"
;                  returns "26").  But due to restrictions on the number of
;                  decimal places the Int() built-in function can handle.  A
;                  number with greater than 14 decimal places (ex.
;                  "25.999999999999999") will be considered the next integer
;                  above the integer part of the value & then 1 will be added
;                  to that (ex. _Ceil("25.999999999999999") returns "27" NOT 26
;                  because there are 15 "9"'s after the decimal point).
;
; Example(s):
;   Dim $Ans = Number( InputBox( "_Ceil() Test", "Please enter a # to test." ) )
;   MsgBox( 4096, "_Ceil() Test", "Ceil( " & $Ans & " )	= " & _Ceil( $Ans ) )
;
;=============================================================================
Func _Ceil($nValue)
	If (Not IsNumber($nValue)) Then
		SetError(1)
		Return (0)
	EndIf
	
	SetError(0)
	Return ( Int($nValue) + 1)
EndFunc   ;==>_Ceil


;=============================================================================
;
; Function Name:   _Floor()
;
; Description:     Returns the next integer value below the specified value.
;
; Syntax:          _Floor( $nValue )
;
; Parameter(s);    $nValue     = Number to be evaluated.
;
; Requirement(s):  External:   = None.
;                  Internal:   = None.
;
; Return Value(s): On Success: = Returns next integer value above $nValue.
;                  On Failure: = Returns 0.
;                  @ERROR:     = 0 = No error.
;                                1 = $nValue isn't a number.
;
; Author(s):       David Nuttall <danuttall at autoit3 com>
;
; Note(s):         Due to restrictions on the number of decimal places the Int()
;                  built-in function can handle. A number with greater than 14
;                  decimal places (ex. "25.999999999999999") will be considered
;                  the next integer above the integer part of the value (ex.
;                  _Floor("25.999999999999999") returns "26" NOT 25 because
;                  there are 15 "9"'s after the decimal point).
;
; Example(s):
;   Dim $Ans = Number( InputBox( "_Floor() Test", "Please enter a # to test." ) )
;   MsgBox( 4096, "_Floor() Test", "Floor( " & $Ans & " )	= " & _Floor( $Ans ) )
;
;=============================================================================
Func _Floor($value)
  If IsInt($value) Then
     Return $value
  ElseIf $value < 0 Then
     Return  Int($value - 1)
  Else
     Return Int($value)
  EndIf
EndFunc ;==>Floor


;===============================================================================
;
; Function Name:    _MathCheckDiv()
; Description:      Checks to see if numberA is divisable by numberB
; Parameter(s):     $i_NumA   - Dividend
;                   $i_NumB   - Divisor
; Requirement(s):   None.
; Return Value(s):  On Success - 1 if not evenly divisable
;                              - 2 if evenly divisable
;                   On Failure - -1 and @error = 1
; Author(s):        Wes Wolfe-Wolvereness <Weswolf@aol.com>
;
;===============================================================================
Func _MathCheckDiv($i_NumA, $i_NumB = 2)
	If Number($i_NumA) = 0 Or Number($i_NumB) = 0 Or Int($i_NumA) <> $i_NumA Or Int($i_NumB) <> $i_NumB Then
		Return -1
		SetError(1)
	ElseIf Int($i_NumA / $i_NumB) <> $i_NumA / $i_NumB Then
		Return 1
	Else
		Return 2
	EndIf
EndFunc   ;==>_MathCheckDiv


;===============================================================================
;
; Function Name:   _Max()
;
; Description:     Evaluates which of the two numbers is higher.
;
; Syntax:          _Max( $nNum1, $nNum2 )
;
; Parameter(s):    $nNum1      = First number
;                  $nNum2      = Second number
;
; Requirement(s):  External:   = None.
;                  Internal:   = None.
;
; Return Value(s): On Success: = Returns the higher of the two numbers
;                  On Failure: = Returns 0.
;                  @ERROR:     = 0 = No error.
;                                1 = $nNum1 isn't a number.
;                                2 = $nNum2 isn't a number.
;
; Author(s):       Jeremy Landes <jlandes@landeserve.com>
;
; Note(s):         Works with floats as well as integers
;
; Example(s):
;   #Include <Math.au3>
;   MsgBox( 4096, "_Max() - Test", "_Max( 3.5, 10 )	= " & _Max( 3.5, 10 ) )
;   Exit
;
;===============================================================================
Func _Max($nNum1, $nNum2)
	; Check to see if the parameters are indeed numbers of some sort.
	If (Not IsNumber($nNum1)) Then
		SetError(1)
		Return (0)
	EndIf
	If (Not IsNumber($nNum2)) Then
		SetError(2)
		Return (0)
	EndIf
	
	If $nNum1 > $nNum2 Then
		Return $nNum1
	Else
		Return $nNum2
	EndIf
EndFunc   ;==>_Max
;===============================================================================


;===============================================================================
;
; Function Name:   _Min()
;
; Description:     Evaluates which of the two numbers is lower.
;
; Syntax:          _Min( $nNum1, $nNum2 )
;
; Parameter(s):    $nNum1      = First number
;                  $nNum2      = Second number
;
; Requirement(s):  External:   = None.
;                  Internal:   = None.
;
; Return Value(s): On Success: = Returns the higher of the two numbers
;                  On Failure: = Returns 0.
;                  @ERROR:     = 0 = No error.
;                                1 = $nNum1 isn't a number.
;                                2 = $nNum2 isn't a number.
;
; Author(s):       Jeremy Landes <jlandes@landeserve.com>
;
; Note(s):         Works with floats as well as integers
;
; Example(s):
;   #Include <Math.au3>
;   MsgBox( 4096, "_Min() - Test", "_Min( 3.5, 10 )	= " & _Min( 3.5, 10 ) )
;   Exit
;
;===============================================================================
Func _Min($nNum1, $nNum2)
	; Check to see if the parameters are indeed numbers of some sort.
	If (Not IsNumber($nNum1)) Then
		SetError(1)
		Return (0)
	EndIf
	If (Not IsNumber($nNum2)) Then
		SetError(2)
		Return (0)
	EndIf
	
	If $nNum1 > $nNum2 Then
		Return $nNum2
	Else
		Return $nNum1
	EndIf
EndFunc   ;==>_Min
