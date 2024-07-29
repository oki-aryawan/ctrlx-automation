PROGRAM PLC_PRG
VAR
	status: BOOL; // on/off
	str_status: STRING;
	emergency: BOOL;
	str_emergency: STRING;
	start: BOOL;
	stop: BOOL;
	str_operation: STRING;
	temp: DINT := 0;
	humid: DINT := 0;
	fan: BOOL;
	fan_status: STRING;
	cool: BOOL;
	cool_status: STRING;
	temp_thres: DINT:= 30;
	humid_thres: DINT:= 60;
	
	random: DINT;
    seed: DINT := 12345;
    a: DINT := 22695477;
    c: DINT := 1;
    m: DINT := 2147483647;
    timer: TON; // Timer for 2 seconds
    timerInterval: TIME := T#2s; // 2-second interval

END_VAR

fan := FALSE;
cool := FALSE;
fan_status := 'OFF';
cool_status := 'OFF';
str_operation:= 'STOP';

// Check emergency condition
// S= set R= reset

IF emergency THEN
	str_emergency := 'ON';
	status := FALSE;
	str_status := 'EMERGENCY';
	str_operation := 'STOP';
ELSE
	str_emergency := 'OFF';
END_IF;

timer(IN := TRUE, PT := timerInterval);

IF status THEN
	str_status := 'ON';
	IF timer.Q THEN
		timer(IN := FALSE);
		timer(IN := TRUE);
		
		// Generate the next random values for temp and humid
		seed := (a * seed + c) MOD m;
		temp := 25 + (seed MOD 21); // Example range for temperature
		seed := (a * seed + c) MOD m;
		humid := 60 + (seed MOD 21); // Example range for humidity
	END_IF
	// Check start and stop conditions
	IF start THEN
		str_operation := 'START';
		
		IF temp > temp_thres THEN
			cool := TRUE;
			cool_status := 'ON';
		ELSE
			cool := FALSE;
			cool_status := 'OFF';
			IF humid > humid_thres THEN
				fan := TRUE;
				fan_status := 'ON';
			ELSE
				fan := FALSE;
				fan_status := 'OFF';
			END_IF;
		END_IF;
	END_IF;

	IF stop THEN
		start := FALSE;
		fan := FALSE;
		cool := FALSE;
		cool_status := 'OFF';
		fan_status := 'OFF';
		str_operation := 'STOP';
	END_IF;
ELSE
	// System is off
	str_status := 'OFF';
	stop := FALSE;
	fan := FALSE;
	cool := FALSE;
	start := FALSE;
	fan_status := 'OFF';
	cool_status := 'OFF';
	str_operation := 'STOP';
END_IF;
