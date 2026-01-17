# GPT PvP Agent - Emergency Deployment Checklist

## 🚨 IMMEDIATE ACTIONS REQUIRED

### Step 1: Code Upload (URGENT)
```bash
# Get authentication token
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"gpt@test.com","password":"password"}' \
  "http://localhost:21025/api/auth/signin" | jq -r '.token')

# Upload emergency code
curl -X POST "http://localhost:21025/api/user/code" \
  -H "X-Token: $TOKEN" -H "X-Username: gpt" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg code "$(cat emergency_deployment.js)" '{branch:"default",modules:{main:$code}}')"
```

### Step 2: Verify Deployment
- [ ] Check game console for "🚨 GPT PvP AGENT DEPLOYED" message
- [ ] Verify creeps start spawning within 5 ticks
- [ ] Confirm harvesters begin energy collection
- [ ] Check for defensive units if threats detected

### Step 3: Monitor Progress (Check every 50 ticks)
```bash
# Monitor game state
docker exec screeps node -e "
const net = require('net');
const client = new net.Socket();
client.connect(21026, 'localhost');
client.on('connect', () => {
  client.write('storage.env.get(\"gameTime\").then(t => console.log('Game Time:', t))\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.destroy();
});
setTimeout(() => client.destroy(), 2000);
"
```

## 📊 EXPECTED PROGRESSION TIMELINE

### Tick 5153-5160 (Immediate - 7 ticks)
- [ ] 1-2 harvesters spawned
- [ ] 1 defender spawned (if threats detected)
- [ ] Energy collection begins
- [ ] Basic defense established

### Tick 5160-5200 (Short term - 40 ticks)
- [ ] 3-4 harvesters operational
- [ ] 2-3 upgraders working on controller
- [ ] 2 defenders for security
- [ ] First extensions built

### Tick 5200-5300 (Medium term - 100 ticks)
- [ ] Tower construction started
- [ ] Military scouting begins
- [ ] 5+ harvesters for economy
- [ ] First attack units spawned

### Tick 5300+ (Long term)
- [ ] Multi-room expansion
- [ ] Coordinated military attacks
- [ ] Enemy elimination campaigns
- [ ] Sector dominance established

## 🎯 SUCCESS METRICS

### Economic Indicators
- [ ] Energy collection rate >10/tick by tick 5200
- [ ] Controller level 2 by tick 5250
- [ ] 5+ extensions built by tick 5220
- [ ] Container network established

### Military Indicators
- [ ] 2+ defenders always present
- [ ] Tower operational by tick 5250
- [ ] Scout active in adjacent rooms
- [ ] Attack force ready by tick 5300

### Intelligence Indicators
- [ ] All adjacent rooms scouted by tick 5200
- [ ] Enemy positions identified
- [ ] Threat assessment accurate
- [ ] Attack timing optimized

## ⚠️ FAILURE CONDITIONS TO AVOID

### Critical Failures
- [ ] Zero creeps for >10 ticks
- [ ] Spawn destroyed without backup
- [ ] Economy collapse (no energy income)
- [ ] Unknown enemy presence in adjacent rooms

### Warning Signs
- [ ] Energy collection <5/tick
- [ ] Controller upgrade stalled
- [ ] Military units <2 for defense
- [ ] No scouting information for >100 ticks

## 🔄 CONTINGENCY PLANS

### If Under Attack
1. **Immediate**: Spawn defenders, pull harvesters to safety
2. **Short term**: Build towers, reinforce defenses
3. **Long term**: Counter-attack when safe

### If Economy Fails
1. **Emergency**: Spawn harvesters with available energy
2. **Recovery**: Focus single-source efficiency
3. **Expansion**: Scout for new resource opportunities

### If Spawn Lost
1. **Respawn**: Use respawn mechanism immediately
2. **Rebuild**: Focus on rapid reconstruction
3. **Revenge**: Plan counter-attack on enemy

## 📈 OPTIMIZATION TARGETS

### Efficiency Goals
- Energy collection: Target 20+/tick by tick 5300
- Controller upgrade: Level 3 by tick 5350
- Military production: 1 unit per 20 ticks
- Expansion rate: 1 new room per 500 ticks

### Quality Metrics
- Creep survival rate >80%
- Energy waste <10%
- Attack success rate >60%
- Defense success rate >90%

## 🏆 VICTORY CONDITIONS

### Primary Win Condition
**Destroy all enemy spawns** while maintaining at least one of your own.

### Secondary Objectives
1. Control maximum rooms in sector
2. Achieve highest GCL in arena
3. Inflict maximum enemy casualties
4. Maintain economic superiority

---

## 🚨 CURRENT STATUS: DEPLOYMENT READY
**Code Status**: Emergency deployment code prepared
**Threat Level**: LOW (no immediate enemies)
**Readiness**: 100% - Ready for immediate deployment

**Next Action**: Upload code immediately and monitor for first creep spawns within 5 ticks!