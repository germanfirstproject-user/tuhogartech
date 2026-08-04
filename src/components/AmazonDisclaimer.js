import styles from './AmazonDisclaimer.module.css';

export default function AmazonDisclaimer({ variant = 'full' }) {
  // Ya no mostramos precios en ninguna parte, así que el aviso no puede
  // hablar de «el precio incluido»: ahora explica por qué no está.
  if (variant === 'price') {
    return (
      <div className={styles.priceDisclaimer}>
        <p className={styles.priceText}>
          ⓘ No mostramos precios ni disponibilidad porque cambian a diario. Los verás
          actualizados en Amazon.
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
            No publicamos precios ni disponibilidad: los fija Amazon y cambian a diario.
            El precio válido es siempre el que aparece en Amazon al completar la compra.
          </p>
        </div>
      </div>
    </div>
  );
}
