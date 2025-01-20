#include-once

; ------------------------------------------------------------------------------
;
; AutoIt Version: 3.0
; Language:       English
; Description:    Functions that assist with Intenet.
;
; ------------------------------------------------------------------------------


;===============================================================================
;
; Function Name:    _Iif()
; Description:      Perform a boolean test within an expression.
; Parameter(s):     $f_Test     - Boolean test.
;                   $v_TrueVal  - Value to return if $f_Test is true.
;                   $v_FalseVal - Value to return if $f_Test is false.
; Requirement(s):   None.
; Return Value(s):  One of $v_TrueVal or $v_FalseVal.
; Author(s):        Dale (Klaatu) Thompson
;
;===============================================================================
Func _Iif($f_Test, $v_TrueVal, $v_FalseVal)
   If $f_Test Then
      Return $v_TrueVal
   Else
      Return $v_FalseVal
   EndIf
EndFunc

