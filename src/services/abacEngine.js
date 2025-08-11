const getValueFromContext = (path, context) => {
  const keys = path.split('.');
  let current = context;
  
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
};

const checkCondition = (path, requirement, context) => {
  const value = getValueFromContext(path, context);
  
  if (Array.isArray(requirement)) {
    return requirement.includes(value);
  }

  return value === requirement;
};

const evaluateRule = (rule, context) => {
  for (const condition of rule.conditions.all) {
    for (const [path, req] of Object.entries(condition)) {
      if (!checkCondition(path, req, context)) return false;
    }
  }
  return true;
};

export const evaluateAccess = (policies, policyName, context) => {
  const policy = policies[policyName];
  if (!policy) return false;

  for (const rule of policy.rules) {
    if (evaluateRule(rule, context)) {
      return rule.effect === "allow";
    }
  }
  return false;
};