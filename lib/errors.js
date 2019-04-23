'use strict';

const defekt = require('defekt');

const errors = defekt([
  'AddressMismatch',
  'ApplicationAlreadyRunning',
  'ApplicationBuilding',
  'ApplicationNotRunning',
  'ApplicationPartiallyRunning',
  'ApplicationTerminating',
  'ApplicationVerifyingConnections',
  'CertificateExpired',
  'CertificateMismatch',
  'CertificateNotYetValid',
  'CodeMalformed',
  'ConfigurationMalformed',
  'ConfigurationNotFound',
  'ConnectionRefused',
  'DirectoryEmpty',
  'DirectoryNotEmpty',
  'DirectoryNotFound',
  'DockerNotReachable',
  'EnvironmentNotAufwind',
  'EnvironmentNotFound',
  'EnvironmentVariableMissing',
  'EventStoreNotEmpty',
  'ExecutableFailed',
  'ExecutableNotFound',
  'ExportInvalid',
  'ExportNotFound',
  'FileAccessModeTooOpen',
  'FileNotAccessible',
  'FileNotFound',
  'FileStorageNotAccessible',
  'FileStorageBucketNotFound',
  'JsonMalformed',
  'OutputMalformed',
  'PortsNotAvailable',
  'ProtocolInvalid',
  'RequestFailed',
  'RuntimeAlreadyInstalled',
  'RuntimeError',
  'RuntimeInUse',
  'RuntimeNotInstalled',
  'SecretFileNotFound',
  'SecretNotFound',
  'SharedKeyMissing',
  'UnknownError',
  'UrlMalformed',
  'VersionMismatch',
  'VersionAlreadyInstalled',
  'VersionNotFound'
]);

module.exports = errors;