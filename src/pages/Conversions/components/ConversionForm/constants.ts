export const LOAD_ON_OPTIONS = [
  { value: 'specific-pages', label: 'Páginas específicas' },
  { value: 'page-path', label: 'Caminho da página' },
  { value: 'regex', label: 'Expressão Regular (Regex)' },
  { value: 'all', label: 'Todo o site' },
];

export const TRIGGER_TYPES = [
  { value: 'time-on-page', label: 'Tempo de Permanência na Página' },
  { value: 'video-watch', label: 'Tempo Assistido do Vídeo' },
  { value: 'form-submit', label: 'Formulário Enviado / Submetido' },
  { value: 'button-click', label: 'Clique no Botão / Elemento' },
  { value: 'element-view', label: 'Visualização de Elemento / Sessão' },
  { value: 'mouse-hover', label: 'Passar o Mouse sobre Elemento' },
  { value: 'scroll-percentage', label: 'Percentual de Rolagem de Página' },
  { value: 'page-visit', label: 'Acessou à Página' },
];

export const EVENT_TYPES = [
  { value: 'AddToWishlist', label: 'AddToWishlist - Adicionar a Lista de Desejo' },
  { value: 'AddPaymentInfo', label: 'AddPaymentInfo - Adicionar Informações de Pagamento' },
  { value: 'InitiateCheckout', label: 'InitiateCheckout - Iniciar Finalização da Compra' },
  { value: 'StartTrial', label: 'StartTrial - Iniciar período de avaliação' },
  { value: 'Subscribe', label: 'Subscribe - Assinou/Renovou um Plano de Assinatura' },
  { value: 'Purchase', label: 'Purchase - Compra Confirmada' },
  { value: 'Contact', label: 'Contact - Entrar em contato' },
  { value: 'CompleteRegistration', label: 'CompleteRegistration - Cadastro Completo' },
];