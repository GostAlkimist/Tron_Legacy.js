// Pruebas unitarias de la lógica del juego. Ejecutar: node --test tests/
const test = require("node:test"); const assert = require("node:assert/strict");
const TL = require("./helpers.js"); const cfg = TL.config;
const newState = () => new TL.GameState();

test("SHA-256: vectores estándar", () => {
  assert.equal(TL.sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(TL.sha256(""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  assert.equal(TL.sha256("á".repeat(100)).length, 64);
});

test("Cadena de rastro: génesis, encadenado y verificación", () => {
  const c = new TL.Chain(); assert.equal(c.length, 1); assert.equal(c.blocks[0].decision_id, "génesis"); assert.equal(c.blocks[0].prev_hash, "0".repeat(64));
  const b = c.record("PD-1", "aceptar", 1); assert.equal(b.index, 1); assert.equal(b.prev_hash, c.blocks[0].hash);
  c.record("PD-2", "firmware", 2); assert.deepEqual(c.verify(), { ok: true, firstBad: -1 });
});
test("Cadena de rastro: detecta alteraciones (RF-DEC-06)", () => {
  const c = new TL.Chain(); c.record("PD-1", "aceptar", 1); c.record("PD-2", "firmware", 2);
  const copy = c.blocks.map(b => ({ ...b })); copy[1].option_id = "ignorar";
  assert.deepEqual(TL.Chain.verifyBlocks(copy), { ok: false, firstBad: 1 });
  const rehash = c.blocks.map(b => ({ ...b })); rehash[1].option_id = "ignorar"; rehash[1].hash = TL.Chain.hashBlock(rehash[1]);
  assert.equal(TL.Chain.verifyBlocks(rehash).firstBad, 2, "el bloque siguiente deja de encajar");
});
test("Cadena de rastro: la API no permite mutar bloques registrados", () => {
  const c = new TL.Chain(); c.record("PD-1", "aceptar", 1); c.blocks[1].option_id = "x";
  assert.equal(c.blocks[1].option_id, "aceptar"); assert.ok(c.verify().ok);
  assert.equal(typeof c.modify, "undefined"); assert.equal(typeof c.delete, "undefined");
});

test("CP-04: la confianza se satura entre 0 y 100", () => {
  const t = new TL.Trust(cfg.trust); assert.equal(t.get("arranque_a"), 50);
  assert.equal(t.add("arranque_a", 200), 100); assert.equal(t.add("arranque_a", -500), 0);
});
test("CP-10: el atajo se desbloquea con confianza de aliados >= 70", () => {
  const t = new TL.Trust(cfg.trust); t.set("arranque_a", 70); t.set("arranque_b", 70); assert.equal(t.shortcutUnlocked(), true);
  t.set("arranque_b", 68); assert.equal(t.shortcutUnlocked(), false); t.set("arranque_a", 72); assert.equal(t.shortcutUnlocked(), true);
});

test("CP-05: visto de forma continua, la amenaza llega a 100 y captura", () => {
  const th = new TL.Threat(cfg.threat); let captured = false, t = 0;
  while (!captured && t < 10) { captured = th.update(0.1, { seen: true }).captured; t += 0.1; }
  assert.ok(captured); assert.ok(t >= 4.9 && t <= 5.2, "captura a ~5 s con 20/s: " + t);
});
test("Amenaza: decae 5/s fuera de visión y multiplicador ×1,25 al ignorar ayuda", () => {
  const th = new TL.Threat(cfg.threat); th.value = 50; th.update(2, { seen: false }); assert.ok(Math.abs(th.value - 40) < 1e-9);
  const a = new TL.Threat(cfg.threat); a.update(1, { seen: true, multiplier: 1.25 }); assert.ok(Math.abs(a.value - 25) < 1e-9);
});
test("CP-06: oculto 10 s con amenaza 80 → 40 (una sola vez por escondite)", () => {
  const th = new TL.Threat(cfg.threat); th.value = 80; let halved = 0;
  for (let i = 0; i < 99; i++) halved += th.update(0.1, { hidden: true }).halved ? 1 : 0; assert.equal(th.value, 80, "antes de 10 s no cambia");
  for (let i = 0; i < 40; i++) halved += th.update(0.1, { hidden: true }).halved ? 1 : 0; assert.equal(th.value, 40); assert.equal(halved, 1);
  th.update(0.1, { hidden: false, seen: false }); th.value = 80; for (let i = 0; i < 101; i++) th.update(0.1, { hidden: true }); assert.equal(th.value, 40, "nuevo escondite, nueva reducción");
});

test("CP-03: alcance de interacción de 3 m", () => {
  assert.equal(TL.Geom.inRange(0, 0, 2.9, 0, 3), true); assert.equal(TL.Geom.inRange(0, 0, 3.1, 0, 3), false);
});
test("Geometría: colisión deslizante y línea de visión", () => {
  const box = { x1: -1, z1: -1, x2: 1, z2: 1, h: 5 }, p = { x: 1.2, z: 0 }; TL.Geom.resolve(p, 0.4, [box]); assert.ok(p.x >= 1.4 - 1e-6);
  assert.equal(TL.Geom.los(-5, 0, 5, 0, [box]), false); assert.equal(TL.Geom.los(-5, 3, 5, 3, [box]), true);
  assert.equal(TL.Geom.los(-5, 0, 5, 0, [{ ...box, h: 1.9 }]), true, "los contenedores bajos no tapan la vista");
});

test("Diálogo: confianza, banderas, variantes y decisión (RF-DIA-07)", () => {
  const st = newState(), d = new TL.Dialogue(st); let v = d.start("s1");
  assert.equal(v.options.length, 3); const r = d.choose(2); assert.equal(st.trust.get("arranque_a"), 40); assert.ok(st.flags.has("silencio_inicial"));
  d.advance(); v = d.view(); assert.match(v.text, /temblando/, "variante por bandera");
  d.choose(1); v = d.view(); assert.match(v.text, /tu silencio no ayuda/);
  const res = d.choose(0); assert.deepEqual(res.decision, { decision_id: "PD-1", option_id: "aceptar" }); assert.deepEqual(d.popEvents(), ["start_chase"]);
});
test("Datos de diálogo: referencias válidas, máx. 3 opciones, hablantes definidos", () => {
  for (const [id, tree] of Object.entries(TL.dialogs)) {
    assert.ok(tree.map[tree.start], id + ": nodo inicial");
    for (const n of Object.values(tree.map)) {
      assert.ok(TL.texts.speakers[n.speaker], id + "/" + n.id + ": hablante " + n.speaker);
      if (n.next) assert.ok(tree.map[n.next], id + "/" + n.id + ": next " + n.next);
      assert.ok((n.options || []).length <= 3, id + "/" + n.id + ": máx. 3 opciones");
      for (const o of n.options || []) { if (o.next) assert.ok(tree.map[o.next], id + "/" + n.id + ": opción→" + o.next); assert.ok(!o.decision_id || o.option_id); }
    }
  }
});

test("Decisiones: efectos de PD-1 y PD-2", () => {
  let st = newState(); TL.Decisions.apply("PD-1", "aceptar", st, st.chain, 1);
  assert.equal(st.trust.get("arranque_a"), 65); assert.ok(st.flags.has("ayuda_aliados")); assert.equal(st.threatMultiplier, 1);
  st = newState(); TL.Decisions.apply("PD-1", "ignorar", st, st.chain, 1); assert.equal(st.threatMultiplier, 1.25); assert.equal(st.trust.get("arranque_b"), 40);
  TL.Decisions.apply("PD-2", "sobrescribir", st, st.chain, 2); assert.equal(st.timePenalty, 60); assert.ok(st.flags.has("sobrescribio"));
  assert.throws(() => TL.Decisions.apply("PD-9", "x", st, st.chain, 1)); assert.throws(() => TL.Decisions.apply("PD-1", "otra", st, st.chain, 1));
});
test("Finales: tres finales distintos con certificado y cadena íntegra (RF-DEC-09)", () => {
  const certs = ["destruir", "rescatar", "escapar"].map(end => {
    const st = newState(); TL.Decisions.apply("PD-1", "aceptar", st, st.chain, 1); TL.Decisions.apply("PD-2", "firmware", st, st.chain, 2); TL.Decisions.apply("PD-3", end, st, st.chain, 3);
    return TL.Decisions.certificate(st, st.chain);
  });
  assert.deepEqual(certs.map(c => c.ending), ["destruir", "rescatar", "escapar"]); certs.forEach(c => { assert.equal(c.chainLength, 4); assert.ok(c.integrity); assert.equal(c.decisions.length, 3); });
  assert.equal(new Set(certs.map(c => c.title)).size, 3);
});
test("Estado: reset reinicia todo (RF-APP-05)", () => {
  const st = newState(); TL.Decisions.apply("PD-1", "aceptar", st, st.chain, 1); st.threat.value = 50; st.flags.add("x"); st.reset();
  assert.equal(st.chain.length, 1); assert.equal(st.threat.value, 0); assert.equal(st.flags.size, 0); assert.deepEqual(st.decisions, {}); assert.equal(st.trust.get("arranque_a"), 50);
});
test("Textos: cada final tiene narrativa y lección; conceptos educativos presentes", () => {
  for (const e of TL.Decisions.ENDINGS) { assert.ok(TL.texts.endings[e].narrative.length > 40); assert.ok(TL.texts.endings[e].lesson); }
  ["edu1", "edu2", "edu3"].forEach(k => assert.ok(TL.texts.edu[k].body.length > 60));
});

test("Voces: pronunciación y minúsculas para texto en mayúsculas", () => {
  const n = TL.Voice.normalize("INTRUSO NO CLASIFICADO. EL BIOS Y EL OS TE VIGILAN.");
  assert.match(n, /intruso no clasificado/); assert.match(n, /bayos/); assert.match(n, /o ese/);
  assert.equal(TL.Voice.normalize("Hola, Don.\nCelda 0x1A"), "Hola, Don.. Celda celda 1A");
  assert.ok(TL.Voice.estimate("x".repeat(130), 1) >= 9.9);
});
test("Voces: asignación de voces en español por personaje", () => {
  const V = (name, lang, local) => ({ name, lang, localService: local });
  const list = [V("Microsoft Sabina", "es-MX", true), V("Microsoft Raul", "es-MX", true), V("Microsoft Helena", "es-ES", true), V("Microsoft Pablo", "es-ES", true), V("English David", "en-US", true), V("Google español", "es-ES", false)];
  const m = TL.Voice.pickVoices(list);
  assert.equal(m.don.name, "Microsoft Raul"); assert.equal(m.arranque_a.name, "Microsoft Sabina"); assert.notEqual(m.arranque_a.name, m.arranque_b.name);
  assert.ok(Object.values(m).every(v => v.lang.startsWith("es")), "nunca elige voces que no sean en español");
  assert.deepEqual(TL.Voice.pickVoices([V("English David", "en-US", true)]), {}, "sin voces en español: sin voz");
  assert.ok(["don", "arranque_a", "arranque_b", "elena", "bios", "sistema", "narrador"].every(k => TL.Voice.PROFILES[k]));
});
