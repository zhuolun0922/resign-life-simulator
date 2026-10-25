const $=s=>document.getElementById(s),pick=a=>a[Math.floor(Math.random()*a.length)],rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));let s,collection=JSON.parse(localStorage.getItem('resign-collection')||'[]');const labels=['精神状态','存款','社会信誉','身体健康'];const endings=['金笼','旷野来信','小城有光','时代弄潮儿','迟来的掌声','手艺人的春天','退休合伙人','平凡也灿烂','山海旅人','一屋两人三餐','社区的老朋友','书页中的余生','财富自由以后','归来的打工人','失败收藏家','负债的远行','无人问津的梦想','最后一班地铁','慢慢好起来','孤独的收藏家','热闹的一生','逆风翻盘','田园守望者','自由的代价'];

function endingIndex(){let[m,w,r]=s.stats,c=s.counts;let top=Object.keys(c).filter(k=>k!=='retire').sort((a,b)=>c[b]-c[a])[0]||'retire';let actions=s.history.map(h=>h.text).join(' ');if(w<-50)return m>50?23:15;if(m<18)return r<35?19:17;if(w<0)return r>65?14:16;if(w>180)return m<45?0:12;if(top==='biz'&&w>80)return 3;if(w>55&&m>65)return 21;if(top==='job')return m<45?0:13;if(top==='media')return r>65?4:5;if(top==='study')return r>60?11:5;if(top==='home')return r>60?22:2;if(top==='gap')return w>20?8:1;if(actions.includes('转让生意'))return 6;if(actions.includes('陪伴')&&m>65)return 9;if(r>80)return 10;if(r>60)return 20;if(m>80)return 7;if(m>50)return 18;return 23}
function showCollection(){$('modalbody').innerHTML=`<p class="eyebrow">THE ENDING ARCHIVE</p><h2>人生有 ${endings.length} 种回响</h2><p class="prompt">已解锁 ${collection.length} / 24 · 记录保存在当前浏览器</p><div class="collection">${endings.map((e,i)=>`<div class="collect-item ${collection.includes(i)?'':'locked'}">${String(i+1).padStart(2,'0')} ${collection.includes(i)?'✦':'◇'}<br>${collection.includes(i)?e:'尚未抵达'}<br><small>${collection.includes(i)?'已收入人生档案':'继续经历不同的人生'}</small></div>`).join('')}</div>`;$('modal').showModal()}

const profiles=[
['林小满',27,'女','杭州','互联网运营','想找回属于自己的生活'],['王大锤',35,'男','北京','程序员','十年没涨薪，我决定先下车'],['陈以安',24,'男','成都','设计师','想在成为大人前先看看世界'],['周知夏',32,'女','上海','广告策划','不想再把深夜留给工作'],['许远',42,'男','武汉','制造业主管','想试着为自己做一次决定'],['赵明月',29,'女','深圳','电商客服','生活不该只有等待发薪']];
const routeNames={start:'离职起点',search:'求职中的你',job:'重返职场',biz:'自己的生意',media:'内容创作',study:'重新学习',gap:'暂时休整',home:'家乡生活',retire:'晚年时光'};
let currentTab='life';
function save(){localStorage.setItem('resign-save',JSON.stringify(s));localStorage.setItem('resign-collection',JSON.stringify(collection))}
function fresh(){let ids=profiles.map((_,i)=>i).filter(i=>i!==s?.avatarId);let id=pick(ids),p=profiles[id];s={version:3,avatarId:id,name:p[0],age:p[1],start:p[1],gender:p[2],city:p[3],job:p[4],bio:p[5],stats:[rand(35,65),rand(5,35),rand(30,65),rand(55,85)],death:rand(75,94),year:1,history:[],counts:{},stage:'choose',family:pick(['未婚 · 独居','已婚 · 无孩','已婚 · 一孩']),talent:pick(['善于表达','行动派','容易内耗','天生乐观']),life:{route:'start',label:'新的开始',phase:'new',years:0,level:0},offers:[]};s.history.push({age:s.age,title:'我裸辞了',text:'交回工牌，接下来的人生由自己来写。'});currentTab='life';save();render();switchTab('life')}
function reroll(){if(s.year>1&&!confirm('重新生成会覆盖当前人生，已解锁图鉴保留。继续吗？'))return;fresh()}
function migrate(){if(s.version!==3){let r=s.lastRoute||(s.event?.title==='Offer 被撤回'?'job':'start');s.life={route:r==='job'&&s.event?.title==='Offer 被撤回'?'search':r,label:({job:'上一份工作',biz:'自己的生意',media:'个人账号',study:'学习计划',gap:'休整计划',home:'家乡生活'})[r]||'新的开始',phase:s.event?.delta?.[1]<0?'tight':'steady',years:1,level:1};s.avatarId=Math.max(0,profiles.findIndex(p=>p[0]===s.name));s.offers=[];s.version=3}if(!s.life)s.life={route:'start',label:'新的开始',phase:'new',years:0,level:0};if(!s.offers)s.offers=[]}
function E(title,text,delta,route,phase='steady',label=null,weight=1){return{title,text,delta,route,phase,label,weight}}
function A(id,title,desc,tag,route,outcomes){return{id,title,desc,tag,route,outcomes}}
function coin(a,b){return s.year%2?a:b}
function jobEntry(id='new-job',title='接住前同事的内推',desc='把旧经验用在新的团队里。'){return A(id,title,desc,'求职 · 收入机会','job',[
E('重新拥有工牌','面试后的等待终于结束。你入职了新团队，开始积累新的同事与项目。',[-4,14,6,-3],'job','steady','新团队'),
E('Offer 又生变故','签约前公司冻结招聘。机会落空了，你保留了沟通记录，准备追讨补偿。',[-10,-4,-1,-1],'search','withdrawn','被撤回的 Offer'),
E('遇到尊重边界的团队','你谈妥了职责与下班时间。收入回来了，也留下一点属于自己的生活。',[8,18,8,1],'job','good','新团队')])}
function bizEntry(id='open-shop',title='从小生意开始',desc='用一笔可控投入试试真实需求。'){return A(id,title,desc,'创业 · 投入有风险','biz',[
E('第一批回头客','试营业没有爆红，但客人开始复购。成本已付，下一年要想办法把它做稳。',[8,-6,8,-3],'biz','steady','小生意'),
E('开张就遇冷','租金和备货照付，客流却比预期少。你需要在追加投入与止损之间做决定。',[-12,-14,-2,-4],'biz','tight','小生意'),
E('刚好赶上需求','你做的东西解决了真实问题。第一年就盈利，接下来扩张还是守成？',[12,22,12,-4],'biz','good','小生意')])}
function mediaEntry(id='start-media',title='把经历做成内容',desc='以自己的经验开一个垂直账号。'){return A(id,title,desc,'创作 · 从零开始','media',[
E('第一个小爆款','一条认真打磨的内容被看见。关注开始增长，也有人询问能否合作。',[10,5,12,-2],'media','good','个人账号'),
E('还没找到观众','更新一年后，互动仍然稀少。你得决定继续深耕，还是换方向。',[-6,-5,3,-3],'media','quiet','个人账号')])}
function studyEntry(id='start-study',title='补上转行的技能',desc='给学习一年，再把它变成新工作。'){return A(id,title,desc,'学习 · 后续可转行','study',[
E('入门了，还差实践','你完成基础课程，有了第一件作品。下一步是考试、实习，还是自己接单？',[8,-6,7,1],'study','learning','转行技能'),
E('课程比预期难','学费已经付了，进度却卡在基础。你需要换种学法，而不是再买一套课。',[-6,-8,2,-2],'study','stuck','转行技能')])}
function restEntry(id='take-rest',title='给身体一个缓冲年',desc='先降速，再决定要走向哪里。'){return A(id,title,desc,'休整 · 消耗积蓄','gap',[
E('终于缓过来了','规律吃饭与睡觉让疲惫松动了一些。积蓄少了，你开始想下一步怎样生活。',[15,-6,0,10],'gap','rested','休整计划'),
E('休息也会焦虑','没有工作后，别人的追问变多了。你开始寻找能负担生活、又不过度消耗自己的方式。',[3,-7,-2,5],'gap','anxious','休整计划')])}
function homeEntry(id='back-home',title='回家乡重新落脚',desc='告别高房租，和家人商量下一步。'){return A(id,title,desc,'返乡 · 改变生活地点','home',[
E('家乡接住了你','生活成本降了下来。熟人问起你的本事，有人想请你帮忙做本地生意。',[10,-3,4,6],'home','settled','家乡生活'),
E('熟悉的地方也要适应','亲近和边界挤在同一张饭桌上。你得在本地工作、家庭陪伴和独立生活间找平衡。',[-3,-4,2,5],'home','friction','家乡生活')])}
function buildOffers(){let l=s.life,level=l.level||0,years=l.years||1,ctx=l.label,offers=[];
if(s.age>=60&&l.route!=='retire'){s.life={...l,origin:l.route,originLabel:l.label,route:'retire',phase:'new',years:0};l=s.life}
if(l.route==='start'){offers=[jobEntry('first-job',`尝试新的${s.job.includes('程序')?'技术岗位':'工作机会'}`,'先谈清待遇与边界，再决定回归。'),bizEntry(),mediaEntry(),restEntry()]}
if(l.route==='search'){offers=[
A('claim',coin('追讨毁约补偿','补齐证据继续交涉'),'上一份 Offer 被撤回，先争回应有补偿。','接续毁约 · 不保证成功','search',[E('补偿终于到账','几轮沟通后，公司支付了补偿。招聘仍在继续，你也有了多一点周转余地。',[7,5,3,0],'search','paid','求职计划'),E('交涉暂时没有结果','对方拖延回复。你保存了证据，也决定不再让这件事占满全部生活。',[-4,-2,1,-1],'search','waiting','求职计划')]),
jobEntry('retry-job',coin('带着上次经验再面试','转向更稳妥的团队'),'这次先核实岗位预算与合同条款。'),
A('contract','先接短期项目','过渡收入能让等待不那么被动。','过渡工作 · 保留求职空间','search',[E('靠项目撑过空档','你交付了一个熟悉领域的项目。生活费有着落，求职还在继续。',[2,8,5,-2],'search','supported','求职计划'),E('项目款被拖欠','客户确认交付，却没按时付款。你留下证据，控制了接下来的开支。',[-8,-3,-1,-2],'search','waiting','求职计划')]),studyEntry('search-study','补齐面试暴露的短板','从求职反馈里找出真正要补的技能。')]}
if(l.route==='job'){offers=[
A('job-stay',coin('把手里的项目做稳','争取更清晰的工作边界'),`你在${ctx}已第 ${years+1} 年，先守住基本盘。`,'延续工作 · 稳定现金流','job',[E('在熟悉中站稳','项目顺利交付，你继续留在团队。收入累积，经验也变得具体。',[2,16+Math.min(level,6),6,-2],'job','steady'),E('组织调整落到身上','团队预算收缩，你带着补偿离开。下一年又要面对找工作和职业转向。',[-8,9,-1,-2],'search','laid-off','裁员后的求职'),E('工作吞掉夜晚','岗位保住了，交付压力也更重。钱多了一点，身体却发来提醒。',[-9,19,4,-6],'job','pressure')]),
A('job-grow',coin('申请晋升和加薪','拿成果去谈新机会'),`用第 ${level+1} 阶段的经验争取更大空间。`,'延续工作 · 收益与压力','job',[E('晋升落地','负责人认可了你的成绩。职位和收入一起增长，也增加了需要处理的人与事。',[6,25+Math.min(level,8),10,-5],'job','promoted'),E('承诺没有兑现','你做完额外任务，晋升却被推迟。留下继续谈，还是离开，需要你下一年回答。',[-10,13,3,-4],'job','pressure')]),
A('job-side',coin('用旧技能试做副业','把副业做成可交付的服务'),'保留主业，先验证一个付费需求。','在职副业 · 时间更紧','job',[E('副业有了付费客户','你用下班后的时间交付小单。收入多一份，精力却更紧张了。',[4,22,7,-7],'job','side'),E('时间不够用了','主业和副业同时催交付。你放弃了几笔订单，开始重新审视工作负荷。',[-7,12,1,-6],'job','pressure')]),
restEntry('job-exit','再次离开这份工作','把离职后的时间留给身体和生活。')]}
if(l.route==='biz'){let tight=l.phase==='tight'||s.stats[1]<5;offers=tight?[
A('biz-cut',coin('缩减成本继续经营','砍掉亏损的业务'),`${ctx}遇到现金压力，先守住周转。`,'经营续篇 · 控制支出','biz',[E('小一点，活下来了','你缩减备货和固定开支，守住愿意复购的客户。生意回到了能呼吸的规模。',[6,8,4,-2],'biz','steady'),E('节流仍赶不上亏损','支出降了，订单却没有跟上。下一年仍需面对这份现金压力。',[-8,-9,-2,-3],'biz','tight')]),
A('biz-bridge',coin('接外单补店里的账','用旧技能给生意输血'),'先用能做的项目补现金缺口。','经营续篇 · 双线奔忙','biz',[E('外单填上了缺口','你把项目收入补进经营账。生意没有停，但两头忙碌让你疲惫。',[1,12,5,-6],'biz','steady'),E('两头都没顾好','外单返工，经营也误了时机。你开始认真考虑是否要止损。',[-10,-7,-3,-5],'biz','tight')]),
A('biz-pivot',coin('换品类，小规模试卖','按客户反馈改产品'),'先做小测试，不再一次压上积蓄。','经营续篇 · 转型试错','biz',[E('新方向接住了需求','一次小试卖找到稳定客户。转型有了起色，下一年可以慢慢加码。',[10,15,7,-3],'biz','good'),E('试卖没有跑通','你及时停下新产品，保住部分现金。旧生意的问题仍然在。',[-5,-5,2,-2],'biz','tight')]),
A('biz-close','结清账目，停止经营','承认这次不合适，带着经验退场。','退出生意 · 进入求职线','search',[E('收起了旧招牌','你清点剩余物资，付清能付的款。经营告一段落，下一年准备重新找工作。',[8,-3,1,5],'search','closed','创业后的求职')])]:[
A('biz-keep',coin('守住现有回头客','按老客户订单稳步经营'),`${ctx}有了基本盘，先把交付做好。`,'经营续篇 · 稳步积累','biz',[E('回头客带来转介绍','熟悉的客户愿意推荐你。小生意又走稳一年，利润慢慢留下来。',[7,15+Math.min(level,8),8,-3],'biz','good'),E('大客户突然延期','货已备好，客户却推迟付款。利润还在账上，现金先紧起来了。',[-9,-12,0,-4],'biz','tight')]),
A('biz-expand',coin('把利润投入新渠道','试着扩大经营半径'),'用已有成绩争取增长，也承担新成本。','经营续篇 · 高波动','biz',[E('新渠道真的打开了','新增客户覆盖了扩张成本。这次冒险带来增长，也让经营变得更复杂。',[10,32+Math.min(level,12),12,-6],'biz','good'),E('扩张快过了需求','新渠道花掉预算，订单没有如期而至。下一年你必须重新整理现金流。',[-12,-22,-5,-6],'biz','tight')]),
A('biz-share',coin('找搭档分担经营','给团队留人，自己减负'),'少拿一点利润，换更可持续的节奏。','经营续篇 · 以收入换精力','biz',[E('终于不必事事亲自来','搭档接住日常交付，你有时间回看产品。利润少一些，生活却宽了一点。',[11,8,6,4],'biz','steady'),E('合作需要磨合','分工与质量产生分歧。你投入时间重写规则，暂时没有等来轻松。',[-5,4,-2,-3],'biz','steady')]),
A('biz-sell','转让生意，带成果退出','把已积累的客户与设备交接出去。','结束经营 · 进入休整线','gap',[E('交接完成','你收回部分投入，也告别亲手做起的生意。下一年终于可以认真休息。',[12,15,5,5],'gap','rested','创业后的休整')])]}
if(l.route==='media'){let quiet=l.phase==='quiet';offers=[
A('media-series',quiet?coin('复盘低播放内容','重新找准账号定位'):coin('把爆款做成系列','继续打磨招牌内容'),quiet?'从读者反馈重写选题和表达。':`围绕${ctx}已有的读者持续创作。`,'创作续篇 · 内容积累','media',[E('观众开始认出你','稳定的表达吸引了长期读者。增长不快，但你有了愿意等待更新的人。',[9,9+Math.min(level,8),10,-3],'media','good'),E('更新了，增长却停住','同类内容变多，数据没有明显起色。你仍需决定深耕还是改变方向。',[-6,-3,2,-4],'media','quiet')]),
A('media-money',coin('谨慎接一条商业合作','和认可的品牌合作'),'先确认产品，再谈报价和交付。','创作续篇 · 收入与口碑','media',[E('合作款顺利到账','产品和受众相符，合作没有伤害信任。你第一次认真考虑把创作作为职业。',[8,18,7,-3],'media','good'),E('合作方临时改需求','加班修改后仍有款项争议。你保留合同，意识到商业边界也需要经营。',[-9,-5,-4,-5],'media','quiet')]),
A('media-community',coin('和读者做一场线下活动','建立小而稳定的社群'),'把一次观看变成长期的相互认识。','创作续篇 · 连接读者','media',[E('流量变成了真实的人','活动规模不大，却有人认真说谢谢。社群带来稳定支持，也需要更多照顾。',[12,4,13,-2],'media','steady'),E('来了很少的人','场地和准备花了钱，报名却没达到预期。你留下反馈，准备调整下一次活动。',[-5,-6,3,-2],'media','quiet')]),
jobEntry('media-exit','带作品去找内容岗位','把账号作品整理成求职案例。')]}
if(l.route==='study'){offers=[
A('study-finish',coin('把卡住的知识补扎实','完成最后一轮学习'),'复盘难点，做完能拿出手的作品。','学习续篇 · 完成积累','study',[E('作品终于成形','你完成一件可以展示的作品。下一年可以尝试接单或带它去应聘。',[10,-4,10,1],'study','ready'),E('基础还需要补','你找到真正薄弱的部分，换了学习方法。离能独立工作还有一段距离。',[-3,-4,4,0],'study','learning')]),
A('study-cert',coin('参加目标资格考试','再冲一次资格认证'),'用成绩检验学到的东西。','学习续篇 · 考试分支','study',[E('证书到手','考核通过了。你不再只有一句想转行，还多了一项能证明自己的资格。',[12,-3,14,0],'study','qualified'),E('差几分没过','你记下失分点，保留了本次复习的积累。继续备考还是先工作，下一年再决定。',[-8,-4,4,-2],'study','stuck')]),
A('study-practice','用新技能接一笔小单','不再只上课，试试真实的交付。','学习续篇 · 进入轻创业','biz',[E('第一位付费客户','你独立完成了交付。单子不大，却让新技能变成了可以继续经营的服务。',[10,5,10,-2],'biz','steady','技能接单'),E('新手也会返工','你花时间修改，最终完成交付。收入不高，但第一次积累了真实客户经验。',[-2,1,5,-3],'biz','steady','技能接单')]),
jobEntry('study-job','带着新作品去应聘','把学习成果交给真实岗位检验。')]}
if(l.route==='gap'){offers=[
A('gap-stay',coin('再给休整一点时间','以低开销维持慢生活'),'规律作息，但仍需消耗生活预算。','休整续篇 · 调整状态','gap',[E('日子重新有了节奏','散步和规律睡眠让你更稳定。你也列出了未来愿意尝试的三件事。',[13,-5,1,8],'gap','rested'),E('余额提醒你向前','身体恢复了一些，积蓄却继续减少。你开始需要一条能养活自己的新路。',[5,-7,-1,5],'gap','anxious')]),
jobEntry('gap-job','按自己的边界重新求职','带着休整后的想法筛选下一份工作。'),
mediaEntry('gap-media','整理这段休整经历','把恢复生活的过程写给同路人。'),homeEntry('gap-home','去家乡延续慢生活','把生活成本降下来，再考虑新方向。')]}
if(l.route==='home'){offers=[
A('home-local',coin('帮本地商家做线上生意','从街坊的需求接起小单'),'把过去的经验用在熟悉的街区。','家乡续篇 · 本地经营','biz',[E('街坊成为第一批客户','一个小项目带来转介绍。你开始在家乡经营一份低成本的服务生意。',[9,7,10,2],'biz','steady','家乡服务生意'),E('熟人单也会难做','需求反复让你学会先定边界。订单交付了，你开始认真做报价和合同。',[-3,3,4,-2],'biz','steady','家乡服务生意')]),
A('home-care',coin('陪家人把日子过稳','和家人重新商量边界'),'照顾彼此，也保留自己的时间。','家乡续篇 · 家庭关系','home',[E('陪伴有了合适的距离','你们商量好日常分工。有人照顾你，你也能照顾到家里。',[12,-3,5,6],'home','settled'),E('饭桌上仍有分歧','对生活的期待并不相同。争论后你们尝试给彼此更多独处空间。',[-5,-4,1,3],'home','friction')]),
jobEntry('home-job','应聘家附近的岗位','通勤短一点，生活和工作重新排布。'),
A('home-create','记录小城里的人与事','把熟悉街巷的故事做成作品。','家乡续篇 · 转向创作','media',[E('小城的故事被看见','老街和普通人的生活引起共鸣。你有了第一批关注本地故事的读者。',[10,3,10,2],'media','good','家乡故事账号'),E('慢慢记，慢慢发','观看的人不多，你仍然整理出一批属于小城的记录。',[4,-3,4,2],'media','quiet','家乡故事账号')])]}
if(l.route==='retire'){let origin=l.originLabel||'这些年的积累';offers=[
A('retire-health',coin('把体检与作息排进日历','坚持散步，认真复查'),'让这一年的身体少一点透支。','晚年续篇 · 健康','retire',[E('规律生活慢慢起效','你按时复查、坚持活动，身体状态好了一些。下一年还有想去的地方。',[8,-5,1,9],'retire','steady'),E('需要一段治疗期','检查发现需要处理的问题。你支付医疗开支，开始按计划休养。',[-5,-12,0,-7],'retire','care')]),
A('retire-share',coin('把一生的经验教给后来人','整理经验，帮年轻人少走弯路'),`把${origin}里学到的东西传下去。`,'晚年续篇 · 经验与连接','retire',[E('经验成为别人的路标','年轻人的反馈让你看见多年积累的价值。你有了新的朋友和约定。',[13,2,12,2],'retire','connected'),E('交流需要重新学习','新一代面对的问题和从前不同。你开始先听他们说，再分享自己的办法。',[4,-2,5,1],'retire','steady')]),
A('retire-hobby',coin('给旧爱好一个固定角落','和朋友继续喜欢的小事'),'种花、读书、下棋，认真过普通一天。','晚年续篇 · 日常','retire',[E('普通日子值得期待','爱好让日子有了节律，朋友也会记得问候你。你开始盼下一次见面。',[13,-4,5,5],'retire','connected'),E('计划被身体打断','一次不适让你取消活动。朋友来探望，你决定把恢复放在下一年的首位。',[-3,-6,3,-4],'retire','care')]),
A('retire-memory',coin('整理旧照片，约老友重逢','写下故事，留给亲近的人'),'把走过的路和没说完的话留下来。','晚年续篇 · 人生回望','retire',[E('回忆被认真接住','你讲起往事，身边的人第一次听见那些选择的细节。普通的一生也有回响。',[14,-3,8,2],'retire','connected'),E('有人已经无法再见','翻到旧照片时，你想起了告别。你写下想说的话，也更珍惜仍能相见的人。',[-4,-2,3,0],'retire','steady')])]}
// Health and debt interrupt the existing story rather than replacing the whole board.
if(s.stats[3]<30&&l.route!=='retire')offers[2]=A('urgent-health','先处理身体的警报',`暂缓${ctx}，给检查和恢复留出时间。`,'当前处境 · 健康优先',l.route,[E('给身体留了一年','你减少工作负荷，按计划检查和休养。原来的方向暂时放慢，下一年仍可以继续。',[9,-9,0,15],l.route,'recovering')]);
if(s.stats[1]<0&&l.route==='biz')offers[1].desc='账上已有负债，先用能做的项目补缺口。';
return offers}
function availableOffers(){migrate();if(s.offers.length!==4){s.offers=buildOffers();save()}return s.offers}
function choose(){s.stage='choose';let offers=availableOffers(),l=s.life;let last=s.history.length>1?s.history.at(-1):null;let context=last?`去年「${last.title}」；${l.label}进入第 ${l.years+1} 年。`:'辞职信已生效。选择一个方向，故事会由此继续。';$('phase').textContent=`${routeNames[l.route]} / ${l.phase==='tight'?'周转告急':l.phase==='pressure'?'压力累积':l.phase==='good'?'机会出现':'故事继续'}`;$('play').innerHTML=`<div class="decision-head"><h3>${s.year===1?'从这里，重新开始。':'接下来，怎样走？'}</h3><p class="prompt">${context}</p></div><div class="choices">${offers.map((o,i)=>`<button class="choice" onclick="takeOffer(${i})"><span class="choice-top"><span class="icon">${['▣','↗','✦','⌂'][i]}</span><span class="arrow">0${i+1}</span></span><strong>${o.title}</strong><p>${o.desc}</p><em>${o.tag}</em></button>`).join('')}</div><p class="hint">◆ 每次选择是一年 · 上一年的结果会改变下一年的处境</p>`}
function takeOffer(i){if(s.stage!=='choose')return;let action=s.offers[i];if(!action)return;let roll=Math.random()*action.outcomes.reduce((n,x)=>n+x.weight,0),out=action.outcomes.at(-1);for(let x of action.outcomes){roll-=x.weight;if(roll<0){out=x;break}}let d=out.delta.slice();if(s.talent==='天生乐观')d[0]+=2;if(s.talent==='容易内耗')d[0]-=1;if(s.talent==='善于表达'&&action.route==='media')d[2]+=3;if(s.stats[1]<0)d[1]+=Math.floor(s.stats[1]*.06);if(s.age>65)d[3]-=Math.floor((s.age-60)/12);let old=s.life,nextRoute=out.route||action.route;s.life={...old,route:nextRoute,label:out.label||(nextRoute===old.route?old.label:routeNames[nextRoute]),phase:out.phase,years:nextRoute===old.route?old.years+1:1,level:nextRoute===old.route?old.level+(d[2]>5?1:0):1};s.stats=s.stats.map((v,j)=>j===1?Math.round((v+d[j])*10)/10:Math.min(100,Math.max(0,v+d[j])));let countRoute=nextRoute==='search'?'job':nextRoute==='retire'?'retire':nextRoute;s.counts[countRoute]=(s.counts[countRoute]||0)+1;s.lastRoute=nextRoute;s.event={title:out.title,text:out.text,delta:d,detail:action.title,from:old.route,to:nextRoute,bridge:`下一年：${routeNames[nextRoute]} · ${out.phase==='tight'?'处理现金流与去留':out.phase==='withdrawn'?'补偿交涉与重新求职':out.phase==='pressure'?'去留与工作边界':out.phase==='learning'?'进阶、考试或实践':out.phase==='good'?'守成、增长或转向':'延续、调整或转向'}`};s.history.push({age:s.age,title:out.title,text:`选择：${action.title}。${out.text}`,route:nextRoute});s.offers=[];s.stage='event';save();render()}
function next(){if(s.stage!=='event')return;s.age++;s.year++;if(s.stats[3]<15)s.death=Math.max(s.age,s.death-2);if(s.age>=s.death||s.stats[3]===0){s.stage='end';s.ending=endingIndex();if(!collection.includes(s.ending))collection.push(s.ending)}else s.stage='choose';save();render()}
function renderEvent(){let e=s.event;$('phase').textContent='年度结算 / 选择留下了回声';$('play').innerHTML=`<div class="event"><div class="event-kicker"><span class="symbol">${e.delta[1]>=0?'✦':'✳'}</span><span>${e.detail}</span></div><h3>${e.title}</h3><p class="event-copy">${e.text}</p><div class="delta">${e.delta.map((v,i)=>`<span>${labels[i]} <b>${v>=0?'+':''}${v}${i===1?'万':''}</b></span>`).join('')}</div><p class="bridge">↳ ${e.bridge||'下一年将根据这段经历继续。'}</p><button class="primary" onclick="next()">收好这一年，继续 →</button></div>`}
// Six code-native pixel portraits: distinct silhouettes, eyes, clothing and accessories.
function portraitSVG(id,age){const configs=[
{hair:'#99633f',light:'#bd8751',coat:'#76a592',trim:'#c0d6be',eye:'#7c6351',style:'long',acc:'bow'},
{hair:'#30303c',light:'#514653',coat:'#566f86',trim:'#c7bfa2',eye:'#594b67',style:'short',acc:'glasses'},
{hair:'#d0ac75',light:'#eed3a2',coat:'#94a373',trim:'#ece0ab',eye:'#668b80',style:'swept',acc:'bag'},
{hair:'#674757',light:'#9a6c79',coat:'#8d7090',trim:'#dfc0a4',eye:'#7b676f',style:'bob',acc:'clip'},
{hair:'#645345',light:'#9e8461',coat:'#6e7c72',trim:'#d1bd8e',eye:'#4c6b66',style:'part',acc:'glasses'},
{hair:'#bb7649',light:'#e7a76b',coat:'#c09b69',trim:'#f0d4a0',eye:'#8a6c51',style:'pony',acc:'ribbon'}];let c={...configs[id%6]};if(age>=65){c.hair='#a8a49a';c.light='#d6d0be'}const rect=(x,y,w,h,col)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`;let r='';
r+=`<ellipse cx="32" cy="76" rx="17" ry="3" fill="#70815b" opacity=".35"/>`;
const outline='#514052',skin='#f3d8bb',shade='#ddad91';
// Hair silhouette and back layers.
if(c.style==='long'||c.style==='pony')r+=`<path d="M10 18h5V10h8V6h20v5h7v9h4v29h-7v7h-9V40H23v14H13v-7H8V27h2z" fill="${outline}"/>`;
else r+=`<path d="M9 19h5V11h9V7h20v4h8v9h5v19h-6v8H15v-7H8V24h1z" fill="${outline}"/>`;
r+=`<path d="M14 18h4v-5h9V10h14v4h8v7h4v15h-5v10H15V35h-4V23h3z" fill="${c.hair}"/>`;
if(c.style==='long')r+=rect(12,31,7,21,c.hair)+rect(46,28,6,24,c.hair)+rect(14,25,3,22,c.light);
if(c.style==='pony')r+=`<path d="M49 16h8v5h3v17h-4v12h-8v-6h4V30h-4z" fill="${c.hair}"/>`;
// Feet, legs, outfit: little body under a large head.
r+=rect(23,61,7,12,outline)+rect(35,61,7,12,outline)+rect(21,72,10,4,outline)+rect(34,72,10,4,outline);
r+=rect(23,61,7,7,c.coat)+rect(35,61,7,7,c.coat);
r+=`<path d="M24 42h17v4h5v6h4v8h-6v6H20v-6h-6v-8h4v-6h6z" fill="${outline}"/>`;
r+=`<path d="M25 44h14v4h5v12H21V48h4z" fill="${c.coat}"/>`;
r+=rect(17,50,5,9,c.coat)+rect(43,50,5,9,c.coat)+rect(17,58,5,4,skin)+rect(43,58,5,4,skin);
r+=`<path d="M26 44l6 6 6-6v-3H26z" fill="${skin}"/><path d="M24 46h5l3 5-5 3-4-5m17-3h-5l-3 5 5 3 4-5" fill="${c.trim}"/>`;
r+=rect(30,53,2,2,c.trim)+rect(30,57,2,2,c.trim)+rect(23,62,18,2,c.trim);
// Head and face, stepped silhouette.
r+=`<path d="M18 21h28v5h4v10h-4v6h-5v4H23v-4h-6v-6h-3V26h4z" fill="${outline}"/><path d="M19 21h26v5h3v10h-5v6H24v-3h-5v-5h-3v-7h3z" fill="${skin}"/>`;
r+=rect(18,33,3,4,shade)+rect(43,33,3,4,shade)+rect(23,36,5,2,'#e8a69d')+rect(38,36,5,2,'#e8a69d');
r+=rect(23,28,6,9,'#fff8e1')+rect(37,28,6,9,'#fff8e1')+rect(25,29,4,7,c.eye)+rect(37,29,4,7,c.eye)+rect(25,29,2,2,'#fffcec')+rect(37,29,2,2,'#fffcec')+rect(25,35,3,2,outline)+rect(38,35,3,2,outline)+rect(31,39,4,1,'#b37b79');
// Each hairstyle changes geometry rather than just hue.
if(c.style==='short')r+=`<path d="M16 23v-8h28v4h5v9h-7v-7h-4v9h-6v-8h-5v6h-6v-5z" fill="${c.hair}"/>`+rect(21,16,8,3,c.light);
if(c.style==='long')r+=`<path d="M16 23v-7h27v4h5v9h-6v-5h-5v-5h-5v9h-6v-5h-4v4h-6z" fill="${c.hair}"/>`+rect(20,16,7,3,c.light);
if(c.style==='swept')r+=`<path d="M14 23v-6h8v-5h20v5h7v8h-9v-5h-6v5h-9v5h-6v-7z" fill="${c.hair}"/>`+rect(19,19,10,3,c.light)+rect(29,14,10,3,c.light);
if(c.style==='bob')r+=`<path d="M14 20h5v-6h23v4h7v20h-5V26h-4v-5H30v6h-5v-4h-5v18h-7V23z" fill="${c.hair}"/>`+rect(17,19,3,10,c.light);
if(c.style==='part')r+=`<path d="M15 23v-7h9v-4h18v5h6v11h-5v-6h-8v-5h-4v9H19v5h-4z" fill="${c.hair}"/>`+rect(18,18,10,3,c.light);
if(c.style==='pony')r+=`<path d="M14 21h5v-7h24v5h6v10h-6v-5h-8v-4h-5v6h-8v5h-7z" fill="${c.hair}"/>`+rect(20,17,9,3,c.light);
if(c.acc==='glasses')r+=`<path d="M21 28h10v9H21zm14 0h10v9H35z" fill="none" stroke="${outline}" stroke-width="1.5"/>`+rect(31,30,4,2,outline);
if(c.acc==='bow')r+=`<path d="M14 10h6v5h5v5h-6v-3h-6v-5z" fill="#b6ce9e"/>`+rect(18,13,4,4,'#657a7b');
if(c.acc==='clip')r+=rect(43,21,7,2,'#e1bd77')+rect(43,25,7,2,'#e1bd77');
if(c.acc==='bag')r+=`<path d="M23 47l20 15" stroke="#625643" stroke-width="2"/>`+rect(37,57,10,8,'#d0b274')+rect(38,58,8,2,'#eee0a7');
if(c.acc==='ribbon')r+=rect(47,20,8,3,'#a66c73')+rect(50,18,3,8,'#ce9394');
return `<svg id="avatar" viewBox="0 0 64 80" shape-rendering="crispEdges" role="img" aria-label="${profiles[id%6][0]}的专属像素形象">${r}</svg>`}
function render(){migrate();$('name').textContent=s.name;$('identity').textContent=`${s.age}岁 · ${s.city} · 前${s.job}`;$('tags').innerHTML=`<span>${s.gender} · ${s.family}</span><span>${s.talent}</span>`;$('bio').textContent='“'+s.bio+'”';$('portrait').innerHTML=portraitSVG(s.avatarId,s.age);$('stats').innerHTML=s.stats.map((v,i)=>`<div class="stat"><div class="stat-label"><span>${labels[i]}</span><b>${i===1?(v<0?'负债':'')+Math.abs(v).toFixed(1)+'万':Math.round(v)+'/100'}</b></div><div class="bar"><i style="width:${Math.min(100,Math.max(0,i===1?v/2:v))}%"></i></div></div>`).join('');$('year').textContent=`${2026+s.year-1} / 离职第 ${String(s.year).padStart(2,'0')} 年`;$('age').textContent=s.age;$('progress').style.width=Math.min(100,(s.age-s.start)/(s.death-s.start)*100)+'%';$('journal').innerHTML=s.history.slice().reverse().map(e=>`<div class="entry"><small>${e.age} 岁 / ${2026+e.age-s.start}</small><h4>${e.title}</h4><p>${e.text}</p></div>`).join('');$('count').textContent=collection.length+'/24';$('scenetext').textContent=s.stage==='end'?'这一生，已存入回忆_':`${routeNames[s.life.route]} · ${s.life.label}`;if(s.stage==='end')renderEnding();else if(s.stage==='event')renderEvent();else choose()}
function switchTab(tab){currentTab=tab;$('chapter').hidden=tab==='record';$('record-panel').hidden=tab!=='record';$('nav-life').classList.toggle('active',tab==='life');$('nav-record').classList.toggle('active',tab==='record')}
function renderEnding(){let i=s.ending;$('phase').textContent='人生终章 / 结局已收入图鉴';$('play').innerHTML=`<div class="ending"><span class="ending-symbol">✦</span><p>结局 ${String(i+1).padStart(2,'0')} / 24</p><h3>${endings[i]}</h3><p>${s.name}的一生停在 ${s.age} 岁。<br>经历 ${s.year-1} 个春秋，留下 ${s.history.length} 段记忆。<br>每一次选择，都成了这段人生的一部分。</p><div class="end-actions"><button class="primary" onclick="fresh()">再过一种人生</button><button class="primary" onclick="showCollection()">结局图鉴</button></div></div>`}
function help(){$('modalbody').innerHTML='<p class="eyebrow">HOW TO LIVE ANOTHER LIFE</p><h2>每一年的选择，都有后续</h2><div class="modal-copy"><p>选择后结算一年，工作、生意、账号或学习会成为持续的人生处境。下一年的选项会承接上一年的结果：生意盈利后考虑扩张，现金紧张时面对节流或退出；被撤回 Offer 后可以追讨补偿、过渡接单或重新求职。</p><p>每个选择有对应的随机结果，结果会改变你的方向、进度与精神、存款、信誉、健康。资金变化已包含该年的日常开支；负债会额外产生 6% 的游戏年利息。</p><p>60 岁进入晚年，之前的经历会作为经验延续。隐藏自然寿命为 75—94 岁，低健康会缩短寿命，健康归零也会进入终章。</p><p>主界面一屏呈现当年信息；点击「记忆」阅读完整人生。进度与图鉴自动保存在本机浏览器。更换角色会覆盖当前人生，图鉴保留。</p><p>全部人物与事件为虚构。信誉指人际与职业口碑，概率不是现实预测。字体：Zpix / SolidZORO，个人项目授权。</p></div>';$('modal').showModal()}
try{s=JSON.parse(localStorage.getItem('resign-save'));if(!s||!s.stats)fresh();else{migrate();render()}}catch{fresh()}
