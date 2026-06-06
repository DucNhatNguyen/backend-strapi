import type { Schema, Struct } from '@strapi/strapi';

export interface BookingBookingItem extends Struct.ComponentSchema {
  collectionName: 'components_booking_items';
  info: {
    description: 'M\u1ED9t d\u1ECBch v\u1EE5 trong \u0111\u01A1n \u0111\u1EB7t h\u00E0ng';
    displayName: 'Booking Item';
  };
  attributes: {
    note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    service: Schema.Attribute.Relation<'oneToOne', 'api::service.service'>;
    servicePackage: Schema.Attribute.Relation<
      'oneToOne',
      'api::service-package.service-package'
    >;
    subtotal: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unitPrice: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface BookingStatusHistory extends Struct.ComponentSchema {
  collectionName: 'components_booking_status_histories';
  info: {
    description: 'Ghi l\u1EA1i l\u1ECBch s\u1EED thay \u0111\u1ED5i tr\u1EA1ng th\u00E1i \u0111\u01A1n';
    displayName: 'L\u1ECBch S\u1EED Tr\u1EA1ng Th\u00E1i';
  };
  attributes: {
    changedAt: Schema.Attribute.DateTime & Schema.Attribute.Required;
    changedBy: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    note: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    status: Schema.Attribute.Enumeration<
      [
        'pending',
        'confirmed',
        'deposit_paid',
        'in_progress',
        'completed',
        'cancelled',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface CommonBannerSlide extends Struct.ComponentSchema {
  collectionName: 'components_common_banner_slides';
  info: {
    description: 'Slide banner cho trang ch\u1EE7';
    displayName: 'Banner Slide';
  };
  attributes: {
    buttonLink: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    buttonText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'booking.booking-item': BookingBookingItem;
      'booking.status-history': BookingStatusHistory;
      'common.banner-slide': CommonBannerSlide;
    }
  }
}
