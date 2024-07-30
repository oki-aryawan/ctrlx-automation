PROGRAM PLC_PRG
VAR
    // PID controller instance
    controller: PID := (KP := 1, TN := 10, TV := 0);
    
    // Process variables
    ActualTemperature: REAL := 30; 
    SetTemperature: REAL := 21;    
    PID_Output: REAL;              
    LimitedOutput: REAL;  // limit
END_VAR


controller.ACTUAL := ActualTemperature;
controller.SET_POINT := SetTemperature;

controller();

PID_Output := controller.Y;

// Limit 0 and 1
IF PID_Output < 0 THEN
    LimitedOutput := 0;
ELSIF PID_Output > 1 THEN
    LimitedOutput := 1;
ELSE
    LimitedOutput := PID_Output;
END_IF

ActualTemperature := ActualTemperature + LimitedOutput - 0.1;
