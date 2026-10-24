# Appendix C — Troubleshooting Handbook

> A quick reference to troubleshooting across the book, indexed by symptom. Each entry gives the most likely cause and the corresponding chapter.

## C.1 Simulation-Side Faults

| Symptom | Likely cause | Handling | Chapter |
|---|---|---|---|
| Simulation crash / numerical explosion | MJCF unit error / non-positive-definite inertia | check units, `validate_mjcf.py` | Ch. 4 |
| Falls immediately on startup | wrong center of mass / inertia | re-check CAD→MJCF | Ch. 4 |
| Violent joint jitter | mismatched BAM parameters | re-calibrate on the bench | Ch. 10 |
| CUDA out of memory | `num_envs` too large | reduce `num_envs` | Ch. 9 |
| Training not converging | sparse reward / poor learning rate | tune reward, lower LR | Ch. 12 |
| Action divergence | missing action/smoothing penalty | add penalties | Ch. 12 |

## C.2 Hardware-Side Faults

| Symptom | Likely cause | Handling | Chapter |
|---|---|---|---|
| A servo doesn't respond | ID conflict | reconfigure the ID | Ch. 6 |
| Random bus packet loss | signal interference | lower baud rate, add isolation | Ch. 6 |
| Freezes on power-on | insufficient power / short | separate power, test one by one | Ch. 6 |
| Position drift | supply voltage sag | check BMS, wire gauge | Ch. 6 |
| Gait jitter | inaccurate BAM / control-loop timeout | re-calibrate / optimize inference | Ch. 10, 14 |
| Attitude slowly tilting | IMU bias / mounting tilt | six-face calibration / compensate tilt | Ch. 8 |
| Frequent falling | observation scaling misaligned | `check_obs_act_space.py` | Ch. 7, 14 |

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
| Servo horn slipping | insufficient interference | replace horn / add adhesive | Ch. 5 |
| Joint seizure | print interference | correct CAD clearance | Ch. 3 |
| Center-of-mass offset | asymmetric assembly | check left-right consistency | Ch. 5 |
| Printed part fracture | insufficient wall thickness/infill | thicken, raise infill | Ch. 5 |
