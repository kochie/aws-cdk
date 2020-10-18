import '@aws-cdk/assert/jest';
// import * as path from 'path';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as timestream from '../lib';

// GLOBAL GIVEN
let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

describe('timestream database', () => {
  test('default configuration produces `Database`', () => {
    new timestream.Database(stack, 'testDatabase');
    expect(stack).toHaveResourceLike('AWS::Timestream::Database');
  });

  test('timestream configures name corrrectly', () => {
    new timestream.Database(stack, 'testDatabase', {
      databaseName: 'custom',
    });

    expect(stack).toHaveResourceLike('AWS::Timestream::Database', {
      DatabaseName: 'custom',
    });
  });

  test('timestream configures kmskeyid corrrectly', () => {
    const key = new kms.Key(stack, 'testKey');

    new timestream.Database(stack, 'testDatabase', {
      kmsKeyId: key.keyId,
    });

    expect(stack).toHaveResourceLike('AWS::Timestream::Database', {
      KmsKeyId: key.keyId,
    });
  });
});

describe('adding database from imported stack', () => {
  let database: timestream.Database;
  let stack_1: cdk.Stack;
  beforeEach(() => {
    stack_1 = new cdk.Stack();
    database = new timestream.Database(stack, 'testDatabase');
  });

  test('imported database can add Database from ARN', () => {
    const importedDatabase = timestream.Database.fromDatabaseArn(stack_1, 'importedDatabase', database.databaseArn);

    expect(stack_1).toHaveResourceLike('AWS::Timestream::Database');
  });
});