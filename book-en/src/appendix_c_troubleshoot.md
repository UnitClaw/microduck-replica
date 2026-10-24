# Appendix C — Troubleshooting Handbook

> A quick reference to troubleshooting across the book, indexed by symptom. Each entry gives the most likely cause and the corresponding chapter.

## C.1 Simulation-Side Faults

| Symptom | Likely cause | Handling | Chapter |
|---|---|---|---|
| Simulation crash / numerical explosion | MJCF unit error / non-positive-definite inertia | check units, `validate_mjcf.py` | Ch. 5 |
| Falls immediately on startup | wrong center of mass / inertia | re-check CAD→MJCF | Ch. 5 |
| Violent joint jitter | mismatched BAM parameters | re-calibrate on the bench | Ch. 11 |
| CUDA out of memory | `num_envs` too large | reduce `num_envs` | Ch. 10 |
| Training not converging | sparse reward / poor learning rate | tune reward, lower LR | Ch. 13 |
| Action divergence | missing action/smoothing penalty | add penalties | Ch. 13 |

## C.2 Hardware-Side Faults

| Symptom | Likely cause | Handling | Chapter |
|---|---|---|---|
| A servo doesn't respond | ID conflict | reconfigure the ID | Ch. 7 |
| Random bus packet loss | signal interference | lower baud rate, add isolation | Ch. 7 |
| Freezes on power-on | insufficient power / short | separate power, test one by one | Ch. 7 |
| Position drift | supply voltage sag | check BMS, wire gauge | Ch. 7 |
| Gait jitter | inaccurate BAM / control-loop timeout | re-calibrate / optimize inference | Ch. 11, 15 |
| Attitude slowly tilting | IMU bias / mounting tilt | six-face calibration / compensate tilt | Ch. 9 |
| Frequent falling | observation scaling misaligned | `check_obs_act_space.py` | Ch. 8, 15 |

## C.3 Sim2Real Difference Troubleshooting (Priority Order)

| Priority | Check item | Tool |
|---|---|---|
| 1 | Observation-space consistency | `check_obs_act_space.py` |
| 2 | Joint-limit alignment | MJCF vs. hardware |
| 3 | IMU bias / mounting | six-face calibration |
| 4 | BAM parameter accuracy | bench fitting |
| 5 | Whole-machine mass / center of mass | weighing vs. CAD |

> Principle: **change only one variable at a time** and record each result, avoiding the inability to locate the cause from changing multiple factors at once.

## C.4 Mechanical-Side Faults

| Symptom | Likely cause | Handling | Chapter |
|---|---|---|---|
| Servo horn slipping | insufficient interference | replace horn / add adhesive | Ch. 6 |
| Joint seizure | print interference | correct CAD clearance | Ch. 4 |
| Center-of-mass offset | asymmetric assembly | check left-right consistency | Ch. 6 |
| Printed part fracture | insufficient wall thickness/infill | thicken, raise infill | Ch. 6 |
