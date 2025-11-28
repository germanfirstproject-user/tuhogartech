import styles from './AmazonDisclaimer.module.css';

export default function AmazonDisclaimer({ variant = 'full' }) {
  if (variant === 'price') {
    return (
      <div className={styles.priceDisclaimer}>
        <p className={styles.priceText}>
          ⓘ El precio incluido puede variar desde la fecha de publicación. Última actualización en Amazon.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.disclaimer}>
      <div className={styles.container}>
        <div className={styles.icon}>ℹ️</div>
        <div className={styles.content}>
          <p className={styles.text}>
            <strong>Aviso de afiliación:</strong> TuHogarTech es un participante del Programa de Afiliados de Amazon EU, 
            un programa de publicidad para afiliados diseñado para ofrecer a sitios web un modo de obtener comisiones 
            por publicidad, publicitando e incluyendo enlaces a Amazon.es y sitios afiliados.
          </p>
          <p className={styles.subtext}>
            Los precios y disponibilidad de los productos pueden variar. Última actualización en la fecha indicada.
          </p>
        </div>
      </div>
    </div>
  );
}
