// Model metadata: emoji + readable label for each CycleGAN model
export const MODEL_META = {
  horse2zebra:            { emoji: '🐴→🦓', label: 'Horse → Zebra' },
  zebra2horse:            { emoji: '🦓→🐴', label: 'Zebra → Horse' },
  apple2orange:           { emoji: '🍎→🍊', label: 'Apple → Orange' },
  orange2apple:           { emoji: '🍊→🍎', label: 'Orange → Apple' },
  summer2winter_yosemite: { emoji: '☀️→❄️', label: 'Summer → Winter' },
  winter2summer_yosemite: { emoji: '❄️→☀️', label: 'Winter → Summer' },
  monet2photo:            { emoji: '🖼️→📷', label: 'Monet → Photo' },
  style_monet:            { emoji: '📷→🎨', label: 'Photo → Monet' },
  style_vangogh:          { emoji: '🌻',    label: 'Van Gogh Style' },
  style_cezanne:          { emoji: '🌿',    label: 'Cézanne Style' },
  map2sat:                { emoji: '🗺️→🛰️', label: 'Map → Satellite' },
  sat2map:                { emoji: '🛰️→🗺️', label: 'Satellite → Map' },
  cityscapes_photo2label: { emoji: '🏙️→🏷️', label: 'Photo → Label' },
  cityscapes_label2photo: { emoji: '🏷️→🏙️', label: 'Label → Photo' },
  facades_photo2label:    { emoji: '🏠→🏷️', label: 'Facades → Label' },
  facades_label2photo:    { emoji: '🏷️→🏠', label: 'Label → Facades' },
  iphone2dslr_flower:     { emoji: '📱→📷', label: 'iPhone → DSLR' },
}

export const getMeta = (name) =>
  MODEL_META[name] ?? { emoji: '🔄', label: name }
