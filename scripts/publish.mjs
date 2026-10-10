import {spawnSync} from 'node:child_process';
import {createInterface} from 'node:readline/promises';
const run=(cmd,args,capture=false)=>{
 const r=spawnSync(cmd,args,{stdio:capture?'pipe':'inherit',encoding:'utf8'});
 if(r.status!==0)throw new Error(`${cmd} ${args.join(' ')} failed. Nothing further was published.`);
 return r.stdout?.trim();
};
if(run('git',['branch','--show-current'],true)!=='main')throw new Error('Switch to the main branch before publishing.');
run('npm',['run','prepare-site']);
console.log('\nThis will commit prepared artwork and settings, then push to GitHub. Netlify will build the website.');
run('git',['diff','--stat']);
const ui=createInterface({input:process.stdin,output:process.stdout});
const answer=await ui.question('Type PUBLISH to continue, or press Enter to stop: ');ui.close();
if(answer!=='PUBLISH'){console.log('Stopped. Your local preview is ready; nothing was pushed.');process.exit(0);}
const unrelated=run('git',['status','--porcelain'],true).split('\n').filter(Boolean).filter(line=>!/^.. ("?content\/|site-settings\.yaml$)/.test(line));
if(unrelated.length)throw new Error('Other project changes need review before publishing:\n'+unrelated.join('\n'));
run('git',['add','--','content','site-settings.yaml']);
const staged=run('git',['diff','--cached','--name-only'],true);
if(staged)run('git',['commit','-m','Update fine art gallery content']);
run('git',['push','origin','main']);
console.log('GitHub accepted the update. Netlify deployment can take a few minutes; check its deploy status before considering publication complete.');
