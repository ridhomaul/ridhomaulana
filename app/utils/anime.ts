import { animate, remove, stagger, createTimeline } from "animejs";

const anime = (options: any) => {
  const { targets, ...parameters } = options;
  return animate(targets, parameters);
};
anime.remove = remove;
anime.stagger = stagger;
anime.timeline = createTimeline;

export default anime;
