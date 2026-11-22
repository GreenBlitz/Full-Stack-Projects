import { z } from "zod";
import type { MatchReport } from "./matchReport";
import { Id } from "@hello-pangea/dnd";
import { IdSchema, SourceDefSchema, PhaseDefSchema, GameObjectDefSchema, LocationDefSchema, SourceListSchema, IdListSchema } from "./buildingBlocks";


// ───────────────────────── Metrics (מה מציגים) ─────────────────────────

export const ActionFilterSchema = z.object({
  phases: IdListSchema.optional(),
  objectIds: IdListSchema.optional(),
  locationIds: IdListSchema.optional(),
  actionIds: IdListSchema.optional(),
});
export type ActionFilter = z.infer<typeof ActionFilterSchema>;

const metricBase = {
  id: IdSchema,
  label: z.string(),
  isHigherBetter: z.boolean(),
  sources: IdListSchema.optional(),
};

export const PointsMetricSchema = z.object({
  ...metricBase,
  kind: z.literal("points"),
  filter: ActionFilterSchema,
  /** לכלול גם נקודות משדות (יציאה מהקו, טיפוס). אם filter.phases מוגדר, רק שדות באותם שלבים */
  includeFields: z.boolean().optional(),
});
export type PointsMetric = z.infer<typeof PointsMetricSchema>;

/** כמה פעמים בוצעו actions (בלי קשר לנקודות) */
export const CountMetricSchema = z.object({
  ...metricBase,
  kind: z.literal("count"),
  filter: ActionFilterSchema,
});
export type CountMetric = z.infer<typeof CountMetricSchema>;

/** שדה בוליאני כשיעור (0..1), למשל "נשבר" */
export const FieldRateMetricSchema = z.object({
  ...metricBase,
  kind: z.literal("fieldRate"),
  fieldId: IdSchema,
});
export type FieldRateMetric = z.infer<typeof FieldRateMetricSchema>;

/** הנקודות של שדה בוליאני / enum */
export const FieldPointsMetricSchema = z.object({
  ...metricBase,
  kind: z.literal("fieldPoints"),
  fieldId: IdSchema,
});
export type FieldPointsMetric = z.infer<typeof FieldPointsMetricSchema>;

/** ממוצע של שדה מספרי: counter או rating */
export const FieldAverageMetricSchema = z.object({
  ...metricBase,
  kind: z.literal("fieldAverage"),
  fieldId: IdSchema,
});
export type FieldAverageMetric = z.infer<typeof FieldAverageMetricSchema>;

/** מחושב בקוד, דרך customMetrics בקונפיג */
export const CustomMetricSchema = z.object({ ...metricBase, kind: z.literal("custom") });
export type CustomMetric = z.infer<typeof CustomMetricSchema>;

export const MetricDefSchema = z.discriminatedUnion("kind", [
  PointsMetricSchema,
  CountMetricSchema,
  FieldRateMetricSchema,
  FieldPointsMetricSchema,
  FieldAverageMetricSchema,
  CustomMetricSchema,
]);
export type MetricDef = z.infer<typeof MetricDefSchema>;

// ───────────────────────── Bee a Scout ─────────────────────────

/** לאן עמודה בטופס של BAS מתורגמת אצלנו */
export const ColumnTargetSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("count"), actionId: IdSchema, phaseId: IdSchema }),
  z.object({ kind: z.literal("field"), fieldId: IdSchema }),
]);
export type ColumnTarget = z.infer<typeof ColumnTargetSchema>;

export const BeeAScoutMappingSchema = z.object({
  /** שמות העמודות של פרטי המשחק בטופס (אלה שמות של עמודות ב-BAS, לא ids, לכן string רגיל) */
  meta: z.object({
    teamNumber: z.string(),
    matchKey: z.string(),
    eventKey: z.string().optional(),
    scouterName: z.string().optional(),
  }),
  /** שם עמודה ב-BAS -> יעד אצלנו */
  columnMap: z.record(z.string(), ColumnTargetSchema),
});
export type BeeAScoutMapping = z.infer<typeof BeeAScoutMappingSchema>;

// ───────────────────────── הקונפיג של עונה ─────────────────────────

/**
 * החלק של העונה שהוא דאטה טהור (אפשר לבדוק, לסריאליזציה ולשלוח ללקוח).
 * בנוסף לצורה, ה-superRefine בודק עקביות בין חלקים: כל הפניה (objectId, phaseId, sourceId, fieldId...)
 * חייבת להצביע על משהו שקיים, ומזהים לא יכולים להיות כפולים.
 */
export const SeasonDataSchema = z
  .object({
    year: z.number().int(),
    sources: z.array(SourceDefSchema).min(1),
    phases: z.array(PhaseDefSchema).min(1),
    gameObjects: z.array(GameObjectDefSchema),
    locations: z.array(LocationDefSchema),
    actions: z.array(ScoreActionDefSchema),
    fields: z.array(FieldDefSchema),
    metrics: z.array(MetricDefSchema),
    beeAScout: BeeAScoutMappingSchema,
  })
  .superRefine((cfg, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });

    // מזהים כפולים
    const uniqueIds = (key: string, items: { id: string }[]) => {
      const seen = new Set<string>();
      items.forEach((item, i) => {
        if (seen.has(item.id)) issue([key, i, "id"], `duplicate id "${item.id}"`);
        seen.add(item.id);
      });
    };
    uniqueIds("sources", cfg.sources);
    uniqueIds("phases", cfg.phases);
    uniqueIds("gameObjects", cfg.gameObjects);
    uniqueIds("locations", cfg.locations);
    uniqueIds("actions", cfg.actions);
    uniqueIds("fields", cfg.fields);
    uniqueIds("metrics", cfg.metrics);

    const sourceIds = new Set(cfg.sources.map((s) => s.id));
    const phaseIds = new Set(cfg.phases.map((p) => p.id));
    const objectIds = new Set(cfg.gameObjects.map((o) => o.id));
    const locationIds = new Set(cfg.locations.map((l) => l.id));
    const actionIds = new Set(cfg.actions.map((a) => a.id));
    const fieldsById = new Map(cfg.fields.map((f) => [f.id, f]));

    const checkRefs = (path: (string | number)[], what: string, ids: string[] | undefined, known: Set<string>) =>
      ids?.forEach((id, i) => {
        if (!known.has(id)) issue([...path, i], `unknown ${what} "${id}"`);
      });

    const checkFilter = (path: (string | number)[], filter: ActionFilter) => {
      checkRefs([...path, "phases"], "phase", filter.phases, phaseIds);
      checkRefs([...path, "objectIds"], "object", filter.objectIds, objectIds);
      checkRefs([...path, "locationIds"], "location", filter.locationIds, locationIds);
      checkRefs([...path, "actionIds"], "action", filter.actionIds, actionIds);
    };

    // actions
    cfg.actions.forEach((a, i) => {
      if (!objectIds.has(a.objectId)) issue(["actions", i, "objectId"], `unknown object "${a.objectId}"`);
      if (!locationIds.has(a.locationId)) issue(["actions", i, "locationId"], `unknown location "${a.locationId}"`);
      checkRefs(["actions", i, "phases"], "phase", a.allowedPhases, phaseIds);
      checkRefs(["actions", i, "sources"], "source", a.sources, sourceIds);
      for (const phase of a.allowedPhases) {
        if (a.pointsPerPhase[phase] === undefined) issue(["actions", i, "points"], `missing points for phase "${phase}"`);
      }
      for (const phase of Object.keys(a.pointsPerPhase)) {
        if (!a.allowedPhases.includes(phase)) {
          issue(["actions", i, "points"], `has points for phase "${phase}" which is not in the action's phases`);
        }
      }
    });

    // fields
    cfg.fields.forEach((f, i) => {
      checkRefs(["fields", i, "sources"], "source", f.sources, sourceIds);
      if (f.phase !== undefined && !phaseIds.has(f.phase)) issue(["fields", i, "phase"], `unknown phase "${f.phase}"`);
      if (f.type === "rating" && f.min >= f.max) issue(["fields", i], "rating min must be smaller than max");
      if (f.type === "enum") {
        const seen = new Set<string>();
        f.options.forEach((o, j) => {
          if (seen.has(o.id)) issue(["fields", i, "options", j, "id"], `duplicate option id "${o.id}"`);
          seen.add(o.id);
        });
      }
    });

    // metrics
    cfg.metrics.forEach((m, i) => {
      checkRefs(["metrics", i, "sources"], "source", m.sources, sourceIds);
      if (m.kind === "points" || m.kind === "count") checkFilter(["metrics", i, "filter"], m.filter);
      if (m.kind === "fieldRate" || m.kind === "fieldPoints" || m.kind === "fieldAverage") {
        const field = fieldsById.get(m.fieldId);
        if (!field) {
          issue(["metrics", i, "fieldId"], `unknown field "${m.fieldId}"`);
          return;
        }
        const allowed =
          m.kind === "fieldRate" ? ["boolean"] : m.kind === "fieldPoints" ? ["boolean", "enum"] : ["counter", "rating"];
        if (!allowed.includes(field.type)) {
          issue(["metrics", i, "fieldId"], `kind "${m.kind}" needs a field of type ${allowed.join("/")}, but "${field.id}" is ${field.type}`);
        }
      }
    });

    // Bee a Scout
    Object.entries(cfg.beeAScout.columnMap).forEach(([column, target]) => {
      const path = ["beeAScout", "columnMap", column];
      if (target.kind === "count") {
        if (!actionIds.has(target.actionId)) issue(path, `unknown action "${target.actionId}"`);
        if (!phaseIds.has(target.phaseId)) issue(path, `unknown phase "${target.phaseId}"`);
      } else if (!fieldsById.has(target.fieldId)) {
        issue(path, `unknown field "${target.fieldId}"`);
      }
    });
  });

export type SeasonData = z.infer<typeof SeasonDataSchema>;

/**
 * פונקציה למטריקה מסוג "custom". פונקציות לא עוברות סריאליזציה ולא שייכות לסכמה,
 * ולכן הן יושבות לצד הדאטה ולא בתוכה.
 */
export type CustomMetricFn = (report: MatchReport, config: SeasonConfig) => number | undefined;

/** הקונפיג המלא של עונה: דאטה (מאומת עם zod) + פונקציות custom */
export type SeasonConfig = SeasonData & {
  customMetrics?: Record<Id, CustomMetricFn>;
};