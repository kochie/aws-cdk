import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDatabase } from './timestream.generated';

/**
 * Represents a Database
 */
export interface IDatabase extends IResource {
  /**
   * The ARN of this database
   * @attribute
   */
  readonly databaseArn: string;

  /**
   * A name for the database.
   * @attribute
   */
  readonly databaseName?: string;

  /**
   * KeyId for the KMS key to encrypt the database with.
   *
   */
  readonly kmsKeyId?: string;
}

/**
 * Properties for creating a timestream database
 */
export interface DatabaseProps {
  /**
   * A name for the database.
   *
   * @default CloudFormation-generated name
   */
  readonly databaseName?: string;

  /**
   * KeyId for the KMS key to encrypt the database with.
   *
   * @default Unencrypted
   */
  readonly kmsKeyId?: string;
}

/**
 * A timestream database instance.
 *
 * @resource AWS::Timestream::Database
 */
export class Database extends Resource implements IDatabase {
  /**
   * Import an existing database provided by ARN
   *
   * @param scope
   * @param id
   * @param databaseArn
   */
  public static fromDatabaseArn(
    scope: Construct,
    id: string,
    databaseArn: string,
  ): IDatabase {
    return Database.fromDatabaseAttributes(scope, id, { databaseArn });
  }

  /**
   * Import an existing database
   *
   * @param scope
   * @param id
   * @param attrs
   */
  public static fromDatabaseAttributes(
    scope: Construct,
    id: string,
    attrs: DatabaseAttributes,
  ): IDatabase {
    const stack = Stack.of(scope);
    const databaseName =
      attrs.databaseName || stack.parseArn(attrs.databaseArn).resource;

    class Import extends Database {
      public readonly databaseArn = attrs.databaseArn;
      public readonly databaseName = databaseName;
    }

    return new Import(scope, id);
  }

  /**
   * A name for the database.
   *
   * @default CloudFormation-generated name
   */
  public readonly databaseName?: string;

  /**
   * KeyId for the KMS key to encrypt the database with.
   *
   * @default Unencrypted
   */
  public readonly kmsKeyId?: string;

  /**
   * The database ARN.
   *
   */
  public readonly databaseArn: string;

  constructor(scope: Construct, id: string, props: DatabaseProps = {}) {
    super(scope, id, {
      physicalName: props.databaseName,
    });

    const database = new CfnDatabase(this, 'Resource', props);

    this.kmsKeyId = database.kmsKeyId;

    this.databaseArn = this.getResourceArnAttribute(database.attrArn, {
      service: 'timestream',
      resource: this.physicalName,
    });

    this.databaseName = this.getResourceNameAttribute(database.databaseName || '');
  }
}

/**
 * Reference to a database
 */
export interface DatabaseAttributes {
  /**
   * The ARN of the database.
   */
  readonly databaseArn: string;

  /**
   * The name of the database.
   *
   * @default CloudFormation-generated name
   */
  readonly databaseName?: string;
}
