"use strict";

// Copied from interface IRecognitionConfig line 510 https://github.com/googleapis/nodejs-speech/blob/master/protos/protos.d.ts
let AudioEncoding;
/** Properties of a SpeechContext. */

(function (AudioEncoding) {
  AudioEncoding[AudioEncoding["ENCODING_UNSPECIFIED"] = 0] = "ENCODING_UNSPECIFIED";
  AudioEncoding[AudioEncoding["LINEAR16"] = 1] = "LINEAR16";
  AudioEncoding[AudioEncoding["FLAC"] = 2] = "FLAC";
  AudioEncoding[AudioEncoding["MULAW"] = 3] = "MULAW";
  AudioEncoding[AudioEncoding["AMR"] = 4] = "AMR";
  AudioEncoding[AudioEncoding["AMR_WB"] = 5] = "AMR_WB";
  AudioEncoding[AudioEncoding["OGG_OPUS"] = 6] = "OGG_OPUS";
  AudioEncoding[AudioEncoding["SPEEX_WITH_HEADER_BYTE"] = 7] = "SPEEX_WITH_HEADER_BYTE";
})(AudioEncoding || (AudioEncoding = {}));

/** InteractionType enum. */
let InteractionType;
/** MicrophoneDistance enum. */

(function (InteractionType) {
  InteractionType[InteractionType["INTERACTION_TYPE_UNSPECIFIED"] = 0] = "INTERACTION_TYPE_UNSPECIFIED";
  InteractionType[InteractionType["DISCUSSION"] = 1] = "DISCUSSION";
  InteractionType[InteractionType["PRESENTATION"] = 2] = "PRESENTATION";
  InteractionType[InteractionType["PHONE_CALL"] = 3] = "PHONE_CALL";
  InteractionType[InteractionType["VOICEMAIL"] = 4] = "VOICEMAIL";
  InteractionType[InteractionType["PROFESSIONALLY_PRODUCED"] = 5] = "PROFESSIONALLY_PRODUCED";
  InteractionType[InteractionType["VOICE_SEARCH"] = 6] = "VOICE_SEARCH";
  InteractionType[InteractionType["VOICE_COMMAND"] = 7] = "VOICE_COMMAND";
  InteractionType[InteractionType["DICTATION"] = 8] = "DICTATION";
})(InteractionType || (InteractionType = {}));

let MicrophoneDistance;
/** OriginalMediaType enum. */

(function (MicrophoneDistance) {
  MicrophoneDistance[MicrophoneDistance["MICROPHONE_DISTANCE_UNSPECIFIED"] = 0] = "MICROPHONE_DISTANCE_UNSPECIFIED";
  MicrophoneDistance[MicrophoneDistance["NEARFIELD"] = 1] = "NEARFIELD";
  MicrophoneDistance[MicrophoneDistance["MIDFIELD"] = 2] = "MIDFIELD";
  MicrophoneDistance[MicrophoneDistance["FARFIELD"] = 3] = "FARFIELD";
})(MicrophoneDistance || (MicrophoneDistance = {}));

let OriginalMediaType;
/** RecordingDeviceType enum. */

(function (OriginalMediaType) {
  OriginalMediaType[OriginalMediaType["ORIGINAL_MEDIA_TYPE_UNSPECIFIED"] = 0] = "ORIGINAL_MEDIA_TYPE_UNSPECIFIED";
  OriginalMediaType[OriginalMediaType["AUDIO"] = 1] = "AUDIO";
  OriginalMediaType[OriginalMediaType["VIDEO"] = 2] = "VIDEO";
})(OriginalMediaType || (OriginalMediaType = {}));

let RecordingDeviceType;

(function (RecordingDeviceType) {
  RecordingDeviceType[RecordingDeviceType["RECORDING_DEVICE_TYPE_UNSPECIFIED"] = 0] = "RECORDING_DEVICE_TYPE_UNSPECIFIED";
  RecordingDeviceType[RecordingDeviceType["SMARTPHONE"] = 1] = "SMARTPHONE";
  RecordingDeviceType[RecordingDeviceType["PC"] = 2] = "PC";
  RecordingDeviceType[RecordingDeviceType["PHONE_LINE"] = 3] = "PHONE_LINE";
  RecordingDeviceType[RecordingDeviceType["VEHICLE"] = 4] = "VEHICLE";
  RecordingDeviceType[RecordingDeviceType["OTHER_OUTDOOR_DEVICE"] = 5] = "OTHER_OUTDOOR_DEVICE";
  RecordingDeviceType[RecordingDeviceType["OTHER_INDOOR_DEVICE"] = 6] = "OTHER_INDOOR_DEVICE";
})(RecordingDeviceType || (RecordingDeviceType = {}));
