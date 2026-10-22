import {test} from 'node:test';
import assert from 'node:assert/strict';
import {temporaryAuthFailure} from '../src/lib/auth-failure.ts';
test('connection failures retain a validated workspace for retry without pretending the user signed out',()=>{
 for(const error of [{name:'AuthRetryableFetchError'},{status:503},{status:502},{status:0},{name:'TypeError',message:'Failed to fetch'},{message:'Network connection interrupted'}])assert.equal(temporaryAuthFailure(error),true);
});
test('expired, revoked, missing and rejected credentials never retain workspace authorization',()=>{
 for(const error of [{status:401},{status:403,name:'AuthRetryableFetchError'},{code:'refresh_token_not_found'},{code:'refresh_token_already_used'},{name:'AuthSessionMissingError'},{status:400,message:'Invalid login credentials'},null])assert.equal(temporaryAuthFailure(error),false);
});
