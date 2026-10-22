export function temporaryAuthFailure(error:{status?:number;name?:string;message?:string;code?:string}|null):boolean {
 if(!error)return false;
 if(error.status===401||error.status===403||error.code==='refresh_token_not_found'||error.code==='refresh_token_already_used'||error.name==='AuthSessionMissingError')return false;
 return error.name==='AuthRetryableFetchError'||(typeof error.status==='number'&&(error.status===0||error.status>=500))||(!error.status&&/fetch|network|timeout|connection/i.test(error.message||''));
}
