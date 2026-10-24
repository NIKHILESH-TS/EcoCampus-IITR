import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  Battery, 
  Wifi, 
  Scale, 
  Ruler, 
  AlertTriangle, 
  CheckCircle2, 
  Code, 
  Terminal,
  Zap,
  RefreshCw,
  Send
} from 'lucide-react';
import { db } from '../../services/db';

export default function IoTSensorSimulator() {
  const [selectedBinId, setSelectedBinId] = useState('GB-042');
  const [fillPercent, setFillPercent] = useState(88);
  const [activeTab, setActiveTab] = useState('gauges'); // 'gauges' | 'telemetry_json' | 'firmware_code'
  const [autoInterruptFired, setAutoInterruptFired] = useState(false);
  const [lastInterruptMsg, setLastInterruptMsg] = useState(null);

  // Derived physical sensor values
  const totalBinHeightCm = 100;
  const measuredDistanceCm = Math.max(8, Math.round(totalBinHeightCm * (1 - fillPercent / 100)));
  const measuredWeightKg = +(2.1 + (fillPercent * 0.26)).toFixed(1);
  const batteryVoltage = +(3.7 + (100 - fillPercent) * 0.004).toFixed(2);
  const wifiRssi = -64 + Math.round((fillPercent % 5));

  const bin = db.getBinById(selectedBinId) || db.getBins()[0];

  useEffect(() => {
    // If fill level crosses 80%, simulate hardware edge interrupt
    if (fillPercent >= 80 && !autoInterruptFired) {
      triggerHardwareInterrupt();
    } else if (fillPercent < 80) {
      setAutoInterruptFired(false);
    }
  }, [fillPercent]);

  const triggerHardwareInterrupt = () => {
    setAutoInterruptFired(true);
    
    // Update bin state in database
    db.updateBin(bin.id, {
      fillLevel: fillPercent,
      status: 'Overflowing'
    });

    // Auto-create hardware interrupt complaint in db
    const res = db.createComplaint({
      binId: bin.id,
      locationText: bin.locationDetail,
      category: bin.category,
      issueType: `IOT_EDGE_INTERRUPT: Bin ${bin.id} exceeded 80% threshold (${fillPercent}% full, ${measuredWeightKg}kg)`,
      details: `Triggered by ESP32 ultrasonic echo = ${measuredDistanceCm}cm, HX711 load = ${measuredWeightKg}kg. Urgent pickup scheduled.`
    });

    setLastInterruptMsg(`[ESP32 Hardware Interrupt] Bin #${bin.id} fired threshold alert. Distance: ${measuredDistanceCm}cm, Load: ${measuredWeightKg}kg. Transmitted via MQTT to Admin Queue.`);
  };

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setFillPercent(val);
    db.updateBin(bin.id, { fillLevel: val });
  };

  const telemetryJson = {
    device_id: `ESP32-SWM-${bin.id}`,
    bin_id: bin.id,
    campus: "IIT_ROORKEE",
    hostel: "GOVIND_BHAWAN",
    block: bin.block,
    sensors: {
      ultrasonic_distance_cm: measuredDistanceCm,
      bin_depth_total_cm: 100,
      fill_percentage: fillPercent,
      weight_kg: measuredWeightKg,
      battery_v: batteryVoltage,
      wifi_rssi_dbm: wifiRssi
    },
    status: fillPercent >= 80 ? "CRITICAL_OVERFLOW" : "NORMAL",
    edge_interrupt_triggered: fillPercent >= 80,
    timestamp: new Date().toISOString()
  };

  const arduinoCode = `// EcoCampus IIT Roorkee - ESP32 Smart Bin Telemetry Firmware
// Hardware: ESP32 + HC-SR04 Ultrasonic Sensor + HX711 Load Cell
#include <WiFi.h>
#include <PubSubClient.h>
#include "HX711.h"

#define TRIG_PIN 5
#define ECHO_PIN 18
#define LOADCELL_DOUT_PIN 21
#define LOADCELL_SCK_PIN 22
#define BIN_HEIGHT_CM 100
#define OVERFLOW_THRESHOLD_PERCENT 80

const char* ssid = "IITR-Campus-WiFi";
const char* mqtt_server = "mqtt.ecocampus.iitr.ac.in";
HX711 scale;

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(2280.f); // Calibrated for 50kg load cells
  scale.tare();
  WiFi.begin(ssid);
}

long measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  long distance = measureDistanceCm();
  float weight = scale.get_units(5);
  int fillPercent = constrain(map(distance, BIN_HEIGHT_CM, 10, 0, 100), 0, 100);

  if (fillPercent >= OVERFLOW_THRESHOLD_PERCENT) {
    // Edge Interrupt: Send priority MQTT packet to Admin Command Desk
    sendPriorityMqttAlert("${bin.id}", fillPercent, weight);
  }
  delay(15000); // 15s heartbeat
}`;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-brand-dark text-white px-2 py-0.5 rounded">
                HARDWARE INNOVATION
              </span>
              <h3 className="font-semibold text-slate-900 text-sm">
                Interactive IoT Sensor Telemetry & Edge Hardware Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstrates how physical ESP32 microcontrollers with HC-SR04 ultrasonic and HX711 load sensors trigger cloud alerts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Test Bin:</span>
            <select
              value={selectedBinId}
              onChange={(e) => setSelectedBinId(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs font-bold text-slate-800"
            >
              <option value="GB-018">#GB-018 (Block A, Bio)</option>
              <option value="GB-042">#GB-042 (Block B, Recycle)</option>
              <option value="GB-104">#GB-104 (Mess, E-Waste)</option>
              <option value="GB-188">#GB-188 (Quadrangle, Inert)</option>
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('gauges')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'gauges'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Physical Hardware Emulation
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('telemetry_json')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'telemetry_json'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Raw MQTT JSON Telemetry
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('firmware_code')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'firmware_code'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ESP32 C++ Firmware Sketch
          </button>
        </div>
      </div>

      {/* Edge Alert Notification if triggered */}
      {autoInterruptFired && lastInterruptMsg && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3.5 flex items-start gap-3 animate-fadeIn text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1 space-y-1">
            <div className="font-bold text-rose-950 flex items-center justify-between">
              <span>⚡ EDGE HARDWARE INTERRUPT DISPATCHED!</span>
              <span className="font-mono text-[10px] bg-rose-200 text-rose-900 px-2 py-0.2 rounded font-bold">
                THRESHOLD &gt; 80% EXCEEDED
              </span>
            </div>
            <p className="font-mono text-rose-900 bg-white/80 p-2 rounded border border-rose-200 text-[11px]">
              "{lastInterruptMsg}"
            </p>
            <span className="text-[10px] text-rose-700 block">
              Auto-logged in Admin Complaints Queue. Turn-by-turn tractor collection triggered.
            </span>
          </div>
        </div>
      )}

      {/* TAB 1: Hardware Gauges & Interactive Slider */}
      {activeTab === 'gauges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Interactive Simulation Slider & Cross Section */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-800 text-xs">
                Real-Time Trash Level Simulator (Drag Slider):
              </span>
              <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                {fillPercent}% Volume
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                value={fillPercent}
                onChange={handleSliderChange}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Empty: 100cm)</span>
                <span>50% (Normal: 55cm)</span>
                <span className="text-rose-600 font-bold">80% Threshold</span>
                <span>100% (Overflow: 8cm)</span>
              </div>
            </div>

            {/* Visual Physical Bin Cross Section */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center gap-6">
              <div className="relative w-28 h-48 bg-slate-200 rounded-lg overflow-hidden border-2 border-slate-700 flex flex-col justify-end shadow-inner">
                {/* Trash fill visual */}
                <div 
                  className={`w-full transition-all duration-300 ${
                    fillPercent >= 80 ? 'bg-rose-500' :
                    fillPercent >= 60 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ height: `${fillPercent}%` }}
                />

                {/* HC-SR04 Sensor representation on lid */}
                <div className="absolute top-1 inset-x-2 h-4 bg-slate-800 rounded flex items-center justify-around px-1 text-[8px] text-emerald-400 font-mono">
                  <span>●</span>
                  <span className="text-[7px]">HC-SR04</span>
                  <span>●</span>
                </div>

                {/* Ultrasonic sound waves */}
                <div 
                  className="absolute top-6 left-1/2 -translate-x-1/2 w-8 border-b-2 border-dashed border-emerald-500/80 transition-all duration-300"
                  style={{ top: `${Math.min(130, 24 + ((100 - fillPercent) * 1.2))}px` }}
                />
              </div>

              {/* Sensor explanations */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5">
                  <div className="text-slate-500 text-[10px]">HC-SR04 Ultrasonic Distance:</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {measuredDistanceCm} cm to waste surface
                  </div>
                  <div className="text-[10px] text-slate-400">Time of flight: ~{Math.round(measuredDistanceCm * 58)} microseconds</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5">
                  <div className="text-slate-500 text-[10px]">HX711 Strain Gauge Weight:</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {measuredWeightKg} kg (Net Waste Mass)
                  </div>
                  <div className="text-[10px] text-slate-400">4x 50kg Wheatstone bridge load cells</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Microcontroller Telemetry Gauges */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-800 text-xs">
                ESP32 Hardware Telemetry Node:
              </span>
              <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded font-bold">
                ONLINE (HEARTBEAT 15s)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 text-slate-700">
                  <Battery className="w-4 h-4 text-emerald-700" />
                  Li-Ion Cell (18650):
                </span>
                <span className="font-mono font-bold text-slate-900">{batteryVoltage} V (92%)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 text-slate-700">
                  <Wifi className="w-4 h-4 text-blue-700" />
                  IITR Mesh Wi-Fi RSSI:
                </span>
                <span className="font-mono font-bold text-slate-900">{wifiRssi} dBm (Strong)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 text-slate-700">
                  <Cpu className="w-4 h-4 text-purple-700" />
                  Microcontroller Core:
                </span>
                <span className="font-mono text-[11px] text-slate-900">ESP32-WROOM-32D</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-2 text-slate-700">
                  <Activity className="w-4 h-4 text-amber-700" />
                  Edge State:
                </span>
                <span className={`font-mono font-bold text-[11px] ${fillPercent >= 80 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {fillPercent >= 80 ? 'INTERRUPT_ACTIVE' : 'IDLE_NORMAL'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              <strong>Pilot Feasibility:</strong> Hardware bill of materials is under <strong>₹1,450 per bin</strong> ($17 USD), making the 200 Govind Bhawan retrofitting highly affordable for IIT Roorkee.
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Raw Telemetry JSON */}
      {activeTab === 'telemetry_json' && (
        <div className="bg-slate-900 text-emerald-400 p-5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span>MQTT Topic: `iitr/swm/govind_bhawan/${bin.id}/telemetry`</span>
            <span className="text-emerald-400">Payload: JSON 2.0</span>
          </div>
          <pre>{JSON.stringify(telemetryJson, null, 2)}</pre>
        </div>
      )}

      {/* TAB 3: Firmware Code */}
      {activeTab === 'firmware_code' && (
        <div className="bg-slate-900 text-slate-200 p-5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span>File: `esp32_smart_bin_firmware.ino`</span>
            <span className="text-amber-400">Ready to flash via Arduino IDE / PlatformIO</span>
          </div>
          <pre className="text-slate-300">{arduinoCode}</pre>
        </div>
      )}

    </div>
  );
}
