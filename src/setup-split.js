import Split from 'split.js';

export default function() {
  Split(['#split-0', '#split-1']);
  Split(['#split-01', '#split-02'], {
    direction: 'vertical'
  });
  Split(['#split-11', '#split-12'], {
    direction: 'vertical'
  });
}

