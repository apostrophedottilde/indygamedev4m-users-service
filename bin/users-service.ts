#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { UsersServiceStack } from '../lib/users-service-stack';

const app = new cdk.App();
new UsersServiceStack(app, 'UsersServiceStack');
